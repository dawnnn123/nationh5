/**
 * 地图交互：悬停省份 → 右侧数据面板更新
 * 全国数据：国家民委第十二批命名决定（2026年1月）
 * 各省：优先示范单位统计；无公开累计数据时展示第七次全国人口普查民族人口统计
 */
(function () {
  'use strict';

  var mapContainer = document.getElementById('mapContainer');
  var provinceLayer = document.getElementById('provinceLayer');
  var nationalBtn = document.getElementById('mapNationalBtn');
  var regionEl = document.getElementById('mapStatsRegion');
  var totalEl = document.getElementById('mapStatsTotal');
  var cumulativeEl = document.getElementById('mapStatsCumulative');
  var cumulativeWrap = document.getElementById('mapStatsCumulativeWrap');
  var totalLabelEl = document.getElementById('mapStatsTotalLabel');
  var infoEl = document.getElementById('mapStatsInfo');
  var noteEl = document.getElementById('mapStatsNote');
  var headingEl = document.querySelector('.map-stats-heading');
  var totalRowEl = document.querySelector('.map-stats-total');
  var statEls = document.querySelectorAll('[data-stat]');
  var labelEls = document.querySelectorAll('[data-label-key]');
  var provinces = [];

  function initProvinceMarkers() {
    if (!provinceLayer || !window.MAP_PROVINCES) return;

    window.MAP_PROVINCES.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'province';
      if (item.small) btn.classList.add('is-small');
      if (item.tiny) btn.classList.add('is-tiny');
      btn.dataset.name = item.name;
      btn.textContent = item.label || item.name;
      btn.style.left = item.left + '%';
      btn.style.top = item.top + '%';
      provinceLayer.appendChild(btn);
    });

    provinces = Array.prototype.slice.call(document.querySelectorAll('.province'));
  }

  initProvinceMarkers();

  if (!provinces.length || !regionEl) return;

  var categories = ['culture', 'economy', 'society', 'unity', 'education', 'volunteer'];

  var demoLabels = {
    culture: '市州盟',
    economy: '县区旗',
    society: '乡镇街道',
    unity: '社区村镇',
    education: '机关企业',
    volunteer: '学校及其他'
  };

  var ethnicLabels = {
    culture: '世居民族',
    economy: '少数民族人口',
    society: '民族乡',
    unity: '自治县旗',
    education: '少数民族占比',
    volunteer: '民族自治地方'
  };

  /** 第十二批全国命名结构（488个） */
  var batch12Weights = [24, 115, 61, 71, 84, 133];

  var nationalStats = {
    view: 'national',
    name: '全国',
    culture: 24,
    economy: 115,
    society: 61,
    unity: 71,
    education: 84,
    volunteer: 133,
    total: 488,
    batchTotal: 488,
    cumulative: 2543,
    info: '第十二批于2026年1月命名488个示范区示范单位（命名有效期5年）。截至2026年1月，全国累计命名十二批共2543个。',
    note: '数据来源：国家民委民委发〔2026〕31号。分项为第十二批全国命名结构。'
  };

  /**
   * 第七次全国人口普查（2020）民族人口相关统计
   * 单位：economy=万人，education=占比%，其余为个数
   */
  var ethnicCensus = {
    '新疆': { culture: 13, economy: 1493, society: 23, unity: 0, education: 57.2, volunteer: 6, info: '少数民族人口1493万人，约占全区57.2%。' },
    '西藏': { culture: 9, economy: 314, society: 0, unity: 0, education: 90.7, volunteer: 7, info: '藏族等世居民族人口约占全区90.7%。' },
    '内蒙古': { culture: 12, economy: 525, society: 0, unity: 0, education: 21.9, volunteer: 3, info: '少数民族人口525万人，约占全区21.9%。' },
    '广西': { culture: 12, economy: 1884, society: 59, unity: 12, education: 37.1, volunteer: 12, info: '少数民族人口1884万人，约占全区37.1%。' },
    '宁夏': { culture: 8, economy: 263, society: 24, unity: 0, education: 37.0, volunteer: 5, info: '回族等少数民族人口263万人，约占全区37%。' },
    '云南': { culture: 25, economy: 1622, society: 151, unity: 29, education: 34.1, volunteer: 29, info: '25个世居少数民族，少数民族人口1622万人。' },
    '贵州': { culture: 18, economy: 1255, society: 199, unity: 11, education: 32.2, volunteer: 11, info: '少数民族人口1255万人，约占全省32.2%。' },
    '甘肃': { culture: 10, economy: 290, society: 36, unity: 7, education: 11.5, volunteer: 7, info: '少数民族人口290万人，约占全省11.5%。' },
    '四川': { culture: 14, economy: 422, society: 58, unity: 18, education: 5.0, volunteer: 18, info: '少数民族人口422万人，18个民族自治县。' },
    '青海': { culture: 10, economy: 293, society: 29, unity: 7, education: 49.7, volunteer: 7, info: '少数民族人口293万人，约占全省49.7%。' },
    '陕西': { culture: 10, economy: 41, society: 5, unity: 0, education: 1.0, volunteer: 0, info: '少数民族人口41万人，回族人口居各省前列。' },
    '山东': { culture: 12, economy: 130, society: 23, unity: 0, education: 1.3, volunteer: 0, info: '少数民族人口130万人，回族、满族居多。' },
    '湖南': { culture: 13, economy: 708, society: 246, unity: 7, education: 10.7, volunteer: 7, info: '土家族、苗族等世居民族，少数民族人口708万人。' },
    '福建': { culture: 10, economy: 56, society: 19, unity: 0, education: 1.4, volunteer: 0, info: '畲族等少数民族人口56万人，18个民族乡。' },
    '河北': { culture: 12, economy: 380, society: 50, unity: 6, education: 5.0, volunteer: 6, info: '少数民族人口380万人，满族、回族、蒙古族等。' },
    '吉林': { culture: 10, economy: 186, society: 33, unity: 4, education: 7.1, volunteer: 4, info: '朝鲜族、满族等少数民族人口186万人。' },
    '辽宁': { culture: 11, economy: 331, society: 50, unity: 8, education: 8.0, volunteer: 8, info: '满族、蒙古族等少数民族人口331万人。' },
    '广东': { culture: 15, economy: 475, society: 54, unity: 3, education: 4.1, volunteer: 3, info: '少数民族人口475万人，瑶族、壮族等世居民族。' },
    '江苏': { culture: 10, economy: 25, society: 2, unity: 0, education: 0.3, volunteer: 0, info: '少数民族人口25万人，各民族流动人口较多。' },
    '浙江': { culture: 12, economy: 40, society: 18, unity: 1, education: 0.6, volunteer: 1, info: '景宁畲族自治县为全省唯一民族自治县。' },
    '湖北': { culture: 12, economy: 284, society: 28, unity: 12, education: 4.8, volunteer: 12, info: '土家族、苗族等少数民族人口284万人。' },
    '黑龙江': { culture: 10, economy: 133, society: 68, unity: 1, education: 4.2, volunteer: 1, info: '满族、朝鲜族等少数民族人口133万人。' },
    '山西': { culture: 8, economy: 17, society: 4, unity: 0, education: 0.5, volunteer: 0, info: '少数民族人口17万人，回族人口相对集中。' },
    '海南': { culture: 10, economy: 176, society: 12, unity: 0, education: 17.3, volunteer: 0, info: '黎族、苗族等少数民族人口176万人，约占17.3%。' },
    '河南': { culture: 15, economy: 141, society: 15, unity: 0, education: 1.4, volunteer: 0, info: '少数民族人口141万人，回族、满族、蒙古族等散居各地。' },
    '台湾': { culture: 16, economy: 57, society: 0, unity: 0, education: 2.4, volunteer: 0, info: '高山族等16个原住民族群，是中华民族大家庭的重要成员。' },
    '北京': { culture: 10, economy: 8, society: 0, unity: 0, education: 0.7, volunteer: 0, info: '少数民族人口约8万人，回族、满族、蒙古族等散居各区。' },
    '天津': { culture: 8, economy: 3, society: 0, unity: 0, education: 0.2, volunteer: 0, info: '少数民族人口约3万人，回族人口相对集中。' },
    '上海': { culture: 10, economy: 4, society: 0, unity: 0, education: 0.2, volunteer: 0, info: '少数民族人口约4万人，各民族流动人口较多。' },
    '重庆': { culture: 12, economy: 36, society: 14, unity: 0, education: 0.4, volunteer: 0, info: '土家族、苗族等少数民族人口36万人，14个民族乡。' },
    '安徽': { culture: 12, economy: 53, society: 9, unity: 0, education: 0.8, volunteer: 0, info: '少数民族人口53万人，畲族为世居民族。' },
    '江西': { culture: 10, economy: 20, society: 8, unity: 0, education: 0.4, volunteer: 0, info: '少数民族人口20万人，畲族、瑶族等世居民族。' },
    '香港': {
      culture: 15,
      economy: 62,
      society: 12,
      unity: 0,
      education: 8.4,
      volunteer: 0,
      info: '据2021年人口普查，香港约62万常住人口属不同族裔，约占8.4%，菲律宾、印尼、印度、尼泊尔等族群与本地中华文化交流交融密切。',
      note: '少数族裔人口为香港2021年人口普查公开摘要约数；内地七普未单列港澳分区。'
    },
    '澳门': {
      culture: 10,
      economy: 4,
      society: 3,
      unity: 0,
      education: 5.3,
      volunteer: 0,
      info: '据2021年人口普查，澳门约3.6万常住人口属不同族裔，约占5.3%，葡裔、菲律宾等族群与中华文化和谐共处。',
      note: '少数族裔人口为澳门2021年人口普查公开摘要约数；内地七普未单列港澳分区。'
    }
  };

  /**
   * 各省示范单位数据
   * mode: cumulative | batch12
   */
  var demoDatabase = {
    '新疆': { mode: 'cumulative', total: 124, info: '第十二批34个入选，和田地区填补地州市创建空白。' },
    '西藏': { mode: 'cumulative', total: 107, info: '7个地市全部创成全国示范，38个县区、69家单位获国家命名。' },
    '内蒙古': { mode: 'cumulative', total: 115, info: '第十二批23个入选，全区累计115个示范区示范单位。' },
    '广西': { mode: 'cumulative', total: 118, info: '第十二批27个入选，全区累计创建118个全国示范区示范单位。' },
    '宁夏': { mode: 'cumulative', total: 94, info: '第十二批17个入选，全区累计94个，实现市县命名全覆盖。' },
    '云南': { mode: 'cumulative', total: 168, info: '第十二批31个入选，累计168个，命名数量居全国前列。' },
    '贵州': { mode: 'cumulative', total: 116, info: '9个市州全部建成全国示范，第十二批新增17个。' },
    '甘肃': { mode: 'cumulative', total: 104, info: '第十二批19个入选，含武威市凉州区火车站街惠民社区。' },
    '四川': { mode: 'cumulative', total: 112, info: '第十二批23个入选，阿坝、甘孜、凉山等民族地区成效突出。' },
    '青海': { mode: 'cumulative', total: 110, info: '第十二批22个入选，所有市州和98%的县建成全国示范区。' },
    '陕西': { mode: 'cumulative', total: 35, info: '第十二批7个入选，含西北工业大学等高校示范单位。' },
    '山东': { mode: 'cumulative', total: 64, info: '第十二批16个入选，全省累计64个全国示范区示范单位。' },
    '湖南': { mode: 'batch12', total: 13, info: '第十二批13个地区和单位入选，覆盖城乡、校园、文旅等领域。' },
    '福建': { mode: 'batch12', total: 8, info: '第十二批8个地方和单位入选，含厦门大学、圣农集团等。' },
    '河北': { mode: 'batch12', total: 14, info: '第十二批14个入选；党的十八大以来全省累计命名55个。' },
    '吉林': { mode: 'batch12', total: 9, info: '第十二批9个入选，长春市为副省级城市中首个全国民族团结进步示范区。' },
    '辽宁': { mode: 'batch12', total: 9, info: '第十二批9个入选，含本溪市、宽甸满族自治县等。' },
    '广东': { mode: 'batch12', total: 6, info: '第十二批6个入选，含深圳市宝安区、连山壮族瑶族自治县等。' },
    '江苏': { mode: 'batch12', total: 4, info: '第十二批4个地区入选，淮阴区为苏北唯一入选县区。' },
    '浙江': { mode: 'batch12', total: 3, info: '第十二批已知入选含鄞州区、柯桥区、慈城镇等（以省民宗委公布为准）。' },
    '湖北': { mode: 'batch12', total: 14, info: '第十二批14个入选，含武汉市洪山区、恩施州宣恩县等。' },
    '黑龙江': { mode: 'batch12', total: 9, info: '第十二批9个入选，含黑龙江大学、梅里斯达斡尔族区等。' },
    '山西': { mode: 'batch12', total: 5, info: '第十二批5个地方和单位入选全国示范区示范单位。' },
    '海南': { mode: 'batch12', total: 8, info: '第十二批8个入选，为历年来海南获评最多的一批。' }
  };

  function distributeByBatch12(total) {
    var sum = batch12Weights.reduce(function (a, b) { return a + b; }, 0);
    var stats = {};
    var allocated = 0;

    categories.forEach(function (key, i) {
      var val;
      if (i === categories.length - 1) {
        val = total - allocated;
      } else {
        val = Math.round(total * batch12Weights[i] / sum);
        allocated += val;
      }
      stats[key] = val;
    });

    return stats;
  }

  function buildEthnicStats(name) {
    var census = ethnicCensus[name];
    if (!census) return null;

    return {
      view: 'ethnic',
      name: name,
      culture: census.culture,
      economy: census.economy,
      society: census.society,
      unity: census.unity,
      education: census.education,
      volunteer: census.volunteer,
      total: census.economy,
      info: census.info,
      note: '数据来源：第七次全国人口普查（2020年）。'
    };
  }

  function buildDemoStats(name, entry) {
    var stats = distributeByBatch12(entry.total);
    stats.view = entry.mode === 'cumulative' ? 'cumulative' : 'batch12';
    stats.name = name;
    stats.total = entry.total;
    stats.info = entry.info;
    stats.note = entry.mode === 'cumulative'
      ? '累计命名数据来自各地民宗部门公开报道（2026年1—2月）；分项按第十二批全国结构比例估算。'
      : '第十二批入选数据来自各地民宗部门公开报道（2026年1—2月）；分项按第十二批全国结构比例估算。';
    return stats;
  }

  function buildProvinceStats(province) {
    var name = province.dataset.name || '';
    var demo = demoDatabase[name];

    if (demo) {
      return buildDemoStats(name, demo);
    }

    var ethnic = buildEthnicStats(name);
    if (ethnic) {
      return ethnic;
    }

    return {
      view: 'ethnic',
      name: name,
      culture: '—',
      economy: '—',
      society: '—',
      unity: '—',
      education: '—',
      volunteer: '—',
      total: '—',
      info: '暂无该地区公开统计数据。',
      note: ''
    };
  }

  function setLabels(labelMap) {
    labelEls.forEach(function (el) {
      var key = el.getAttribute('data-label-key');
      if (key && labelMap[key]) {
        el.textContent = labelMap[key];
      }
    });
  }

  function formatStatValue(key, value, view) {
    if (value === '—' || value == null) return '—';
    if (view === 'ethnic') {
      if (key === 'economy') return value + '<span class="map-stats-unit">万</span>';
      if (key === 'education') return value + '%';
    }
    return value;
  }

  function renderStats(stats) {
    regionEl.textContent = '【 ' + stats.name + ' 】';

    if (headingEl) {
      headingEl.textContent = stats.view === 'ethnic'
        ? '民族人口与自治地方'
        : '民族团结进步示范成果';
    }

    if (stats.view === 'ethnic') {
      setLabels(ethnicLabels);
    } else {
      setLabels(demoLabels);
    }

    statEls.forEach(function (el) {
      var key = el.getAttribute('data-stat');
      var formatted = formatStatValue(key, stats[key], stats.view);
      if (stats.view === 'ethnic' && (key === 'economy')) {
        el.innerHTML = formatted;
      } else {
        el.textContent = formatted;
      }
    });

    if (stats.view === 'national') {
      if (totalRowEl) totalRowEl.hidden = false;
      if (totalLabelEl) totalLabelEl.textContent = '第十二批';
      if (totalEl) totalEl.textContent = stats.batchTotal;
      if (cumulativeWrap) cumulativeWrap.hidden = false;
      if (cumulativeEl) cumulativeEl.textContent = stats.cumulative;
    } else if (stats.view === 'ethnic') {
      if (totalRowEl) totalRowEl.hidden = true;
    } else if (stats.view === 'batch12') {
      if (totalRowEl) totalRowEl.hidden = false;
      if (totalLabelEl) totalLabelEl.textContent = '第十二批';
      if (totalEl) totalEl.textContent = stats.total;
      if (cumulativeWrap) cumulativeWrap.hidden = true;
    } else {
      if (totalRowEl) totalRowEl.hidden = false;
      if (totalLabelEl) totalLabelEl.textContent = '累计命名';
      if (totalEl) totalEl.textContent = stats.total;
      if (cumulativeWrap) cumulativeWrap.hidden = true;
    }

    if (infoEl) infoEl.textContent = stats.info || '';
    if (noteEl) noteEl.textContent = stats.note || '';
  }

  function showNational() {
    provinces.forEach(function (p) { p.classList.remove('active'); });
    if (nationalBtn) nationalBtn.classList.add('active');
    renderStats(nationalStats);
  }

  function showProvince(province) {
    provinces.forEach(function (p) { p.classList.remove('active'); });
    if (nationalBtn) nationalBtn.classList.remove('active');
    province.classList.add('active');
    renderStats(buildProvinceStats(province));
  }

  provinces.forEach(function (prov) {
    prov.addEventListener('mouseenter', function () {
      showProvince(this);
    });

    prov.addEventListener('click', function () {
      showProvince(this);
    });
  });

  if (nationalBtn) {
    nationalBtn.addEventListener('mouseenter', showNational);
    nationalBtn.addEventListener('click', showNational);
  }

  if (mapContainer) {
    mapContainer.addEventListener('mouseleave', showNational);
  }

  showNational();
})();
