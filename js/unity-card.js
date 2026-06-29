/**
 * 团结页 · 三卡片详情
 */
(function () {
  'use strict';

  var articles = {
    handshake: {
      theme: 'theme-unity-handshake',
      tag: '【 手足情深 】',
      title: '手足情深',
      subtitle: '守望相助 · 血脉相连',
      date: '2026-06-18',
      paragraphs: [
        '手足情深，是民族团结最质朴、最动人的情感底色。它不在宏大的口号里，而在邻里相望的晨昏、在危难时刻的援手、在超越血缘的亲缘之中。',
        '冬日的凉州区火车站街惠民社区，巷陌间的"红石榴"标识格外醒目。社区创新"六治联动"治理模式，5支"红石榴"志愿服务队穿梭在楼栋院落，"马中海红石榴工作室"耐心调解矛盾纠纷，"七步议事法"让群众的烦心事就地化解。各族居民从旁观者变成参与者，社区真正成为民族团结之家。',
        '贵州铜仁榨子村地处黔渝交界，各族群众世代聚居、习俗互通、生活相融。土家族村民付永祥说："村里各族乡亲常年住在一起，实打实就是一家人。"苗族媳妇董仕淑将酥食、麻饼手艺传给邻里，各族饮食文化在方寸餐桌上交融共生，邻里守望的温暖筑牢了民族团结的根基。',
        '在宁波职业技术学院，米娜瓦尔·艾力用18年时间穿梭于各民族学生之间，通过学业结对、实践平台和精准心理疏导，帮助少数民族学生克服适应困境。她说："当各族青年像石榴籽般紧密团结，手足相亲、守望相助就有了最鲜活的时代注脚。"'
      ]
    },
    prosper: {
      theme: 'theme-unity-prosper',
      tag: '【 共同发展 】',
      title: '共同发展',
      subtitle: '携手并进 · 共享繁荣',
      date: '2026-06-15',
      paragraphs: [
        '共同发展是民族团结的物质基石。"全面建成小康社会，一个民族都不能少"，深刻体现了我国坚持各民族共同繁荣发展的基本原则，也映照出社会主义制度集中力量办大事的显著优势。',
        '闽宁协作携着跨越两千多公里的山海之约走过二十九载，让"干沙滩"变成产业兴旺、民生和美、精神昂扬的"金沙滩"。闽宁产业园、葡萄酒基地、纺织服装园区等一批产业项目落地生根，西海固移民从学徒成长为技术骨干，戈壁荒滩变成了各族群众共建共享的"紫色银行"。',
        '对口援疆、援藏和对口支援云南等工作持续推进，从产业扶持到教育医疗，从基础设施到干部人才支援，帮助民族地区补齐短板、增强内生动力。察右后旗马铃薯产业综合产值突破15亿元，惠及4.2万各族群众，各族技术员与农牧民携手研发新技术，在产业链上各展所长、共享收益。',
        '从"输血"到"造血"，从单项援助到系统推进，共同发展让各族群众的日子越过越红火，民族团结就有了最坚实的物质基础和最深切的情感认同。'
      ]
    },
    identity: {
      theme: 'theme-unity-identity',
      tag: '【 文化认同 】',
      title: '文化认同',
      subtitle: '多元一体 · 兼收并蓄',
      date: '2026-06-12',
      paragraphs: [
        '文化认同是民族团结最深沉、最持久的力量。各民族文化交相辉映，共同铸就了中华文明历久弥新的辉煌；增进文化认同，就是铸牢中华民族共同体意识最深厚的根基。',
        '在永宁县，"丝路织语·闽宁艺栈"非遗保护传承交流平台陈列闽宁两地20余种非遗代表性项目，设有互动体验区，各族群众可近距离参与剪纸、编织等技艺。"过去觉得非遗离我们很远，现在出门走几步就能体验到"——文化认同在可感可及的参与中悄然生长。',
        '在德江县，土家族傩戏传承人安永柏从事傩堂戏表演50余年，各族群众常开展跳花灯、跳傩戏等民俗文化活动。在迪庆香格里拉，端午节融合挂艾草、品粽子与藏族马术竞技、帐篷欢聚等民俗，形成独具地方特色的节庆形态，各族群众在共庆共乐中拉近距离、心意相通。',
        '多元一体，不是文化的趋同，而是在尊重差异中增进认同、在交流互鉴中丰富发展。当中华文化认同的种子埋进各族群众心底，民族团结就有了最坚实、最持久的土壤。'
      ]
    }
  };

  var hero = document.getElementById('detailHero');
  var tagEl = document.getElementById('detailTag');
  var titleEl = document.getElementById('detailTitle');
  var subtitleEl = document.getElementById('detailSubtitle');
  var metaEl = document.getElementById('detailMeta');
  var bodyEl = document.getElementById('detailBody');
  var pageTitle = document.getElementById('pageTitle');

  if (!hero || !bodyEl) return;

  var cat = new URLSearchParams(location.search).get('cat');
  var article = cat ? articles[cat] : null;

  if (!article) {
    document.title = '团结专题 · 民族同心馆';
    if (titleEl) titleEl.textContent = '未找到内容';
    if (subtitleEl) subtitleEl.textContent = '请从团结页重新选择专题进入';
    hero.className = 'detail-hero theme-default';
    bodyEl.innerHTML = '<p>未找到对应专题，请返回团结页点击"手足情深""共同发展"或"文化认同"卡片。</p>';
    return;
  }

  document.title = article.title + ' · 民族团结';
  if (pageTitle) pageTitle.textContent = article.title;

  hero.className = 'detail-hero ' + (article.theme || 'theme-default');
  if (tagEl) tagEl.textContent = article.tag;
  if (titleEl) titleEl.textContent = article.title;
  if (subtitleEl) subtitleEl.textContent = article.subtitle;
  if (metaEl) metaEl.textContent = '发布时间：' + article.date;

  bodyEl.innerHTML = article.paragraphs.map(function (p) {
    return '<p>' + p + '</p>';
  }).join('');
})();
