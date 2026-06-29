/**
 * 详情页内容（轮播图 id=1~4 等）
 */
(function () {
  'use strict';

  var articles = {
    '1': {
      theme: 'theme-1',
      tag: '民族团结',
      title: '石榴花开一家亲',
      subtitle: '各民族像石榴籽一样紧紧抱在一起',
      date: '2026-06-18',
      paragraphs: [
        '一、石榴花开：中华民族共同体的生动写照',
        '石榴，多籽多福、紧紧相依，是各民族手足相亲、守望相助的象征。习近平总书记在考察中多次以“石榴籽”作比喻，强调“各民族要相互了解、相互尊重、相互包容、相互欣赏、相互学习、相互帮助，像石榴籽一样紧紧抱在一起”。',
        '我国56个民族共同开拓了辽阔的疆域，共同书写了悠久的历史，共同创造了灿烂的文化，共同培育了伟大的精神。中华民族共同体意识是国家统一之基、民族团结之本、精神力量之魂。',
        '二、校园里的“石榴花”：米娜瓦尔·艾力的18年坚守',
        '在宁波职业技术学院，米娜瓦尔·艾力用18年时间，陪伴28个民族的近5000名学生顺利完成学业。她探索出的“米娜工作法”在全国高校推广，2024年获评全国民族团结进步模范个人。',
        '她的学生吾拉买买提·马地苏甫毕业后回到塔什库尔干县成为一名护边员，守卫在祖国最西部的边境线上；维吾尔族学生迪力木拉提·艾尼在乌鲁木齐创办公司后，向母校捐赠1万元资助贫困生……',
        '米娜老师说：“我愿做民族团结进步事业的追梦人，让每一朵‘石榴花’紧紧相依。”',
        '三、社区里的“石榴果”：各族群众亲如一家',
        '在宁夏银川，58岁的王菊茹通过社区平台与北方民族大学少数民族学生结对认亲，十年间蒙古族、柯尔克孜族、维吾尔族、土家族、壮族的10名大学生都成了她的“干儿子”“干女儿”。每逢节日她都在微信群里说：“孩子们，回家吃饭！”——一句“回家”，跨越了血缘，也跨越了民族。',
        '在甘肃武威惠民社区，“红石榴驿站”集矛盾调解、便民服务、议事协商于一体，孵化“巧娘手工坊”帮助200余名群众灵活就业，创收400余万元。',
        '四、边疆上的“石榴根”：把异乡当故乡',
        '在新疆莎车，民警钟云飞4年坚守村警务室，自掏腰包为打馕兄弟解决场地设备；在云南磨憨，驻村干部杨奇武与6个民族11名队员组成联防队，巡逻在17.8公里的国境线上。',
        '他们用行动证明：民族团结不需要豪言壮语，只需要——你把异乡当故乡，我把异族当亲人；你为我点亮一盏灯，我为你温暖一个家。',
        '石榴花开，籽籽同心。56个民族，一个都不能少；56个民族，永远是一家。'
      ]
    },
    '2': {
      theme: 'theme-2',
      tag: '文化交融',
      title: '文化交融 · 美美与共',
      subtitle: '各民族文化交相辉映，中华文明历久弥新',
      date: '2026-06-15',
      paragraphs: [
        '一、千年传承：饭养身，歌养心',
        '“不种田无法把命来养活，不唱歌日子怎么过！饭养身子歌养心哟，活路要做也要唱歌……”这首侗族歌谣，道出了侗族人民对歌唱的信仰。',
        '侗族大歌源于春秋战国时期，距今已有2500多年的历史，是最具特色的中国民间音乐艺术之一。在黔湘桂交界的侗乡，几乎每个村寨都有自己的歌队，歌师们在农闲时无偿传授歌谣，使几十人的合唱无需指挥便能自然成调，其多声部的精密程度堪比专业合唱乐团。',
        '侗族没有自己的文字，历史上都靠歌唱来传承民族的历史文化。侗族大歌不仅是一种音乐艺术形式，更是承载着族源记忆、伦理规范、生态智慧的立体文化系统，对于侗族人民的文化传承和凝聚起着重要作用。',
        '二、走向世界：从巴黎到联合国',
        '1986年秋，侗族大歌走出国门，亮相法国巴黎金秋艺术节。欧洲乐评界将其描述为“清泉般闪光的音乐，掠过古梦边缘的旋律”。',
        '2006年，侗族大歌被列入第一批国家级非物质文化遗产名录；2009年，联合国教科文组织将其列入人类非物质文化遗产代表作名录，驳斥了西方“中国无双声音乐”的论断。',
        '三、创新传承：古老歌声焕发新活力',
        '获得“非遗身份”并非文化保护的终点，而是创造性传承与发展的起点。最新的案例之一是，贵州侗族姑娘组成的“舞月蝉歌”合唱队，以侗族大歌的多声部唱法演绎了2025年春节档电影《哪吒之魔童闹海》中“宝莲盛开”片段的配乐，空灵婉转的歌声深深打动了听众。',
        '同时，各地通过“非遗+线上直播”“非遗+旅游”“非遗+课堂”等多种创新模式，让侗族大歌焕发新光彩，也为乡村文化振兴注入源头活水。',
        '四、文化交融：歌声里的中华民族共同体',
        '侗族音乐的价值已远远超越艺术审美的单一维度，深刻融入当代中华民族共同体构建中。它以无可辩驳的艺术实证，展现了中华文化的多样性与创造性，为铸牢中华民族共同体意识提供了可感知、可共鸣的美学载体。',
        '正如习近平总书记在贵州考察时所强调的：“少数民族文化是中华文化不可或缺的组成部分，既要保护有形的村落、民居、特色建筑风貌，传承无形的非物质文化遗产，又要推动其创造性转化、创新性发展，让民族特色在利用中更加鲜亮，不断焕发新的光彩。”'
      ]
    },
    '3': {
      theme: 'theme-3',
      tag: '共同繁荣',
      title: '共同繁荣 · 一个都不能少',
      subtitle: '全面建成小康社会，各民族携手前行',
      date: '2026-06-12',
      paragraphs: [
        '一、历史起点：一场跨越山海的决定',
        '1996年，党中央作出东西部扶贫协作战略部署，确定福建与宁夏结对帮扶。1997年，时任福建省委副书记的习近平同志深入宁夏西海固调研，提出建设“闽宁村”的构想，拉开了这场跨越山海“接力跑”的序幕。',
        '30年来，两省区坚持“优势互补、互惠互利、长期协作、共同发展”的协作原则，一以贯之、久久为功，形成了“福建企业+宁夏资源”“福建总部+宁夏基地”“福建市场+宁夏产品”等一批产业协作模式。',
        '二、产业协作：从“输血”到“造血”',
        '飞毛腿集团全产业链转移：2018年起，飞毛腿集团将广东东莞的生产线整体转移至宁夏固原市原州区，建成6条全自动化生产线。从2018年至今，集团累计接收宁夏籍员工2615名，其中1645名建档立卡贫困户实现稳定脱贫。“就业一人，脱贫一家”的愿景，在这里成为现实。',
        '盐池滩羊联农带农：闽宁滩羊产业发展融合园创新推行“闽宁协作+企业+协会+合作社+养殖户”的联农带农模式，连续5年以高于市场价10%的价格收购农户养殖的滩羊。截至目前，累计订单收购农户滩羊280余万只，惠及养殖户1万余户，户均年均增收1.6万元。',
        '东数西算·闽数宁算：在闽宁镇，绿电数智应用中心配置了四条100G毫秒级的跨省电路，可形成约2500P的算力，为千里之外的福建提供算力支撑，实现“宁夏生产算力，福建无感调用”。',
        '三、民生帮扶：医疗教育下沉基层',
        '医疗“组团式”援宁：福建累计选派医疗人才7000余人次赴宁帮扶，41家医院结对帮扶宁夏29家医院。在红寺堡区人民医院，4批37名专家扎根4年，帮助医院完善180余项管理制度，建成心血管内科、创伤外科2个自治区级重点专科，累计实施白内障免费手术960例。2025年门急诊量较2022年增长46%，县域内就诊率超过90%。',
        '教育援宁：福建累计选派教育人才7000余人次，推动122所学校结对帮扶宁夏84所学校。闽宁二小与福建3所优质学校建立结对帮扶，引入中央音乐学院乡村音乐教室，获评自治区“互联网+教育”标杆校。'
      ]
    },
    '4': {
      theme: 'theme-4',
      tag: '守望相助',
      title: '守望相助 · 同心筑梦',
      subtitle: '共建美好家园，共筑中华民族伟大复兴中国梦',
      date: '2026-06-08',
      paragraphs: [
        '什么是红石榴驿站？',
        '“红石榴驿站”是以铸牢中华民族共同体意识为主线，依托社区现有服务资源升级改造的民族团结综合服务阵地。它集民生服务、文化交融、社会治理三大功能于一体，让各族群众在家门口就能享受到精准化服务。',
        '在呼和浩特，全市已打造459家“红石榴驿站”，配套建设共享活动室、民族团结主题长廊，让各族群众在“抬头不见低头见”的空间里拉近物理距离。',
        
        '1. 民生服务：精准帮扶暖人心',
        '楚雄彝人古镇社区“红石榴驿站”整合“零工驿站”“工会驿站”等资源，每周更新发布不少于20条岗位信息，开设彝绣技艺班、家政服务实操班、电商直播培训班等，累计培训各族群众2000余人次，帮助1000余名群众实现就业。',
        '驿站还组建专项服务队伍，为各民族困难群众提供生活帮扶——向低保户发放慰问物资，为老年人、残疾人提供上门服务，已累计服务100余人次。',
        '2. 文化交融：构筑共有精神家园',
        '驿站设置民族文化展示区、活动角，常态化开展民族团结主题活动。“红石榴驿站”展厅通过图文展板、实物陈列、多媒体视频等形式，全方位呈现各民族和谐共生的历史与文化。',
        '在黑龙江同江文采社区，“红石榴驿站”挂满各民族“全家福”的笑脸墙，赫哲族老党员用民族语言和汉语为群众解读政策，让居民“听得懂、记得牢、传得开”。',
        '3. 社会治理：小事不出网格，大事不出社区',
        '驿站设立“红石榴议事厅”，组织各民族群众代表、商户代表、党员骨干召开议事会，收集群众对社区治理的意见建议。楚雄彝人古镇社区已推动解决停车位不足、老年活动场地升级等民生问题。',
        '在呼和浩特，全市推行“网格党小组+网格员+楼栋长”的“铁三角”模式，组建7493个网格党小组，配备6158名专职网格员，累计处置邻里、婚恋等纠纷隐患3012件。',
        
        '文采社区的“五心服务”',
        '同江市文采社区聚集了赫哲族、朝鲜族等七个民族的居民。社区以“初心、连心、同心、齐心、暖心”的“五心”服务理念，打造“居民之家”。民族团结技艺小屋帮助全职妈妈、特殊群体学员通过手工编织增收近两万元。',
        '彝人古镇的“小阵地大团结”',
        '楚雄市彝人古镇社区“红石榴驿站”通过“民生服务”“文化传承”“成长关怀”三大板块，推出“好市成双”优品汇展销活动，联动本地民族特色商户，实现“文化展示+经济发展”的双向赋能。托管中心引入AI伴学测评系统，累计服务各族学生150余人次。'
      ]
    }
  };

  if (window.newsArticles) {
    Object.keys(window.newsArticles).forEach(function (key) {
      articles[key] = window.newsArticles[key];
    });
  }

  /** 站点根路径（兼容 GitHub Pages 子目录，如 /nationh5/） */
  function getSiteBase() {
    var path = location.pathname || '/';
    var pagesIdx = path.indexOf('/pages/');
    if (pagesIdx !== -1) return path.slice(0, pagesIdx + 1);
    var lastSlash = path.lastIndexOf('/');
    if (lastSlash <= 0) return '/';
    var file = path.slice(lastSlash + 1);
    if (file && file.indexOf('.') !== -1) return path.slice(0, lastSlash + 1);
    return path.endsWith('/') ? path : path + '/';
  }

  function resolveImagePath(src) {
    if (!src) return '';
    if (/^https?:\/\//i.test(src)) return src;
    var clean = src.replace(/^\/+/, '');
    return getSiteBase() + clean;
  }

  function renderCover(article) {
    if (article.image) {
      var imgSrc = resolveImagePath(article.image);
      var alt = article.title ? article.title.replace(/"/g, '&quot;') : '';
      return '<figure class="detail-cover"><img src="' + imgSrc + '" alt="' + alt + '"></figure>';
    }
    return '<figure class="detail-cover detail-cover-placeholder" aria-hidden="true"><span>头图占位 · 可在 js/news-data.js 对应条目的 image 字段填入图片路径</span></figure>';
  }

  var hero = document.getElementById('detailHero');
  var tagEl = document.getElementById('detailTag');
  var titleEl = document.getElementById('detailTitle');
  var subtitleEl = document.getElementById('detailSubtitle');
  var metaEl = document.getElementById('detailMeta');
  var bodyEl = document.getElementById('detailBody');
  var pageTitle = document.getElementById('pageTitle');

  if (!hero || !bodyEl) return;

  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var cat = params.get('cat');
  var article = id ? articles[id] : null;

  if (article) {
    document.title = article.title + ' · 民族同心馆';
    if (pageTitle) pageTitle.textContent = article.title;

    hero.className = 'detail-hero ' + (article.theme || 'theme-default');
    if (tagEl) tagEl.textContent = article.tag;
    if (titleEl) titleEl.textContent = article.title;
    if (subtitleEl) subtitleEl.textContent = article.subtitle;
    if (metaEl) metaEl.textContent = '发布时间：' + article.date;

    var backEl = document.getElementById('detailBack');
    if (backEl) {
      if (id && id.charAt(0) === 'n') {
        backEl.href = '../index.html#section-news';
        backEl.textContent = '← 返回动态资讯';
      } else {
        backEl.href = '../index.html#section-banner';
        backEl.textContent = '← 返回首页';
      }
    }

    var coverHtml = (id && id.charAt(0) === 'n') ? renderCover(article) : '';
    bodyEl.innerHTML = coverHtml + article.paragraphs.map(function (p) {
      return '<p>' + p + '</p>';
    }).join('');
    return;
  }

  if (cat === 'news') {
    document.title = '动态资讯 · 民族同心馆';
    if (pageTitle) pageTitle.textContent = '动态资讯';
    hero.className = 'detail-hero theme-news';
    if (tagEl) tagEl.textContent = '资讯';
    if (titleEl) titleEl.textContent = '动态资讯';
    if (subtitleEl) subtitleEl.textContent = '各民族交往交流交融最新动态';
    if (metaEl) metaEl.textContent = '';

    var backElNews = document.getElementById('detailBack');
    if (backElNews) {
      backElNews.href = '../index.html#section-news';
      backElNews.textContent = '← 返回动态资讯';
    }

    var newsList = window.newsArticles || {};
    var keys = Object.keys(newsList).sort();
    var listHtml = '<ul class="detail-news-list">';
    keys.forEach(function (key) {
      var item = newsList[key];
      listHtml += '<li><a href="detail.html?id=' + key + '">' +
        '<time>' + item.date + '</time>' +
        '<span class="detail-news-tag">' + item.tag + '</span>' +
        '<strong>' + item.title + '</strong>' +
        '<p>' + item.summary + '</p>' +
        '</a></li>';
    });
    listHtml += '</ul>';
    bodyEl.innerHTML = listHtml;
    return;
  }

  document.title = '详情 · 民族同心馆';
  if (titleEl) titleEl.textContent = '内容详情';
  if (subtitleEl) subtitleEl.textContent = '暂无对应内容';
  hero.className = 'detail-hero theme-default';
  if (metaEl) metaEl.textContent = '参数：' + (location.search || '（无）');
  bodyEl.innerHTML = '<p>未找到对应内容，请从首页轮播图或相关栏目重新进入。</p>';
})();
