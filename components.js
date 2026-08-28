window.COMPONENTS = [
  {
    id: "structure",
    name: "页面结构",
    emoji: "🏗️",
    items: [
      { id: "structure-1", name: "单页网站", en: "Single-page Website", desc: "全塞一页，锚点跳转", emoji: "📄", prompt: "为浩然制作一个单页个人作品网站，页面顺序为 Hero、About、Selected Work、Writing、Contact 和 Footer；顶部导航通过 Anchor Links 跳转到对应区块，使用平滑滚动但尊重 prefers-reduced-motion，每个区块都设置清晰的 id 和语义化标题。" },
      { id: "structure-2", name: "多页网站", en: "Multi-page Website", desc: "每块独立网址，长期好扩展", emoji: "📚", prompt: "把浩然的网站设计为多页网站，包含 Home、Work、Project Detail、About、Journal、Article 和 Contact；所有页面共享统一的 Header 与 Footer，当前导航项显示 active 状态，项目卡片点击后进入独立详情页。" },
      { id: "structure-3", name: "落地页", en: "Landing Page", desc: "只为一个目标", emoji: "🎯", prompt: "为浩然的 AI 设计服务制作一个 Landing Page，唯一目标是引导访客预约咨询；页面包含 Hero、服务价值、工作流程、三个案例、客户评价、FAQ 和最终 CTA，所有主要按钮统一使用“预约一次沟通”，不要加入与转化目标无关的复杂导航。" },
      { id: "structure-4", name: "案例研究页", en: "Case Study Page", desc: "讲清过程，不止晒结果", emoji: "📊", prompt: "为浩然创建一个项目案例研究页，包含项目概览、背景问题、浩然的职责、设计过程、关键决策、最终方案、结果数据和复盘；顶部使用大封面，正文保持窄阅读宽度，过程图片可全宽穿插，桌面端右侧提供 Sticky Table of Contents。" },
      { id: "structure-5", name: "首屏 Hero", en: "Hero Section", desc: "第一屏说清你是谁", emoji: "🏠", prompt: "为浩然的个人主页创建一个清晰的 Hero Section，主标题为“浩然 designs and builds AI-native experiences.”，副标题控制在两行以内，包含 View Work 和 Contact 两个按钮；右侧使用抽象、低饱和的网页界面意象，不要使用办公桌、家居产品或商业图库人物。" },
      { id: "structure-6", name: "功能网格", en: "Feature Grid", desc: "3-6 个模块并列介绍", emoji: "🔲", prompt: "在浩然的 About 区块下方添加一个四列 Feature Grid，四项内容为 Design、Frontend、AI Prototyping 和 Writing，每项包含一个线性图标、标题和不超过两行的说明；桌面端四列，平板两列，手机单列，避免夸张阴影。" },
      { id: "structure-7", name: "固定叙事区", en: "Sticky Storytelling", desc: "一侧固定，滚动讲故事", emoji: "📖", prompt: "为浩然的项目详情页设计一个 Sticky Storytelling Section，桌面端左侧 38% 区域保持 Sticky 并展示当前阶段标题和说明，右侧依次滚动展示 Discover、Design、Build 三个内容面板；当前阶段进入视口时更新左侧文字，手机端取消 Sticky 并改为正常纵向排列。" },
      { id: "structure-8", name: "时间线", en: "Timeline", desc: "一条线串起经历", emoji: "🕐", prompt: "在浩然的 About 页面添加一条 Vertical Timeline，每个节点包含年份、事件名称和两行说明；桌面端内容位于时间线右侧，手机端保持单列；使用细绿色线条和圆形节点，不要做成复杂路线地图。" },
      { id: "structure-9", name: "常见问题", en: "FAQ Section", desc: "折叠面板消除疑虑", emoji: "❓", prompt: "在浩然的 Contact 页面之前添加 FAQ Section，包含 6 个问题，例如浩然接受什么项目、合作周期多久、是否提供开发、如何开始合作；答案默认折叠，同一时间只允许打开一个问题，使用原生 button 并正确设置 aria-expanded。" },
      { id: "structure-10", name: "页脚", en: "Footer", desc: "收尾区，别浪费", emoji: "📍", prompt: "为浩然的个人网站设计一个完整 Footer，左侧显示浩然 Logo 和一句简介，中间分为 Explore、Connect、Elsewhere 三组链接，右侧显示邮箱和 Newsletter 订阅框，底部显示版权与隐私链接；使用深绿色背景和米白文字，与页面主体形成明确收尾。" }
    ]
  },
  {
    id: "navigation",
    name: "导航与切换",
    emoji: "🧭",
    items: [
      { id: "navigation-1", name: "固定导航", en: "Sticky Navbar", desc: "滚动也不消失", emoji: "📌", prompt: "为浩然的网站添加 Sticky Navbar，初始状态使用透明背景，滚动超过 40px 后变为米白背景并增加细边框和轻微 backdrop blur；导航高度保持稳定，移动端使用 Hamburger Menu。" },
      { id: "navigation-2", name: "汉堡菜单", en: "Hamburger Menu", desc: "三条线，滑出 Drawer", emoji: "🍔", prompt: "浩然网站在 768px 以下使用 Hamburger Menu，右上角显示三条横线按钮，点击后从右侧滑出 Drawer，包含 Home、Work、About、Writing 和 Contact；打开后锁定背景滚动，支持 Esc 关闭、点击遮罩关闭和键盘焦点管理。" },
      { id: "navigation-3", name: "面包屑", en: "Breadcrumb", desc: "显示层级路径", emoji: "🍞", prompt: "在浩然的项目详情页顶部添加 Breadcrumb，路径为 Home › Work › AI Tools › Project Detail；使用 nav aria-label=\"Breadcrumb\" 和有序列表，最后一项表示当前页面，不设置链接，并添加 aria-current=\"page\"。" },
      { id: "navigation-4", name: "锚点跳转", en: "Anchor Link", desc: "点一下滚到对应区块", emoji: "⚓", prompt: "为浩然的单页网站添加 Anchor Links，About、Work、Writing、Contact 分别链接到对应 section id；点击后平滑滚动，到达区块时预留 Sticky Header 高度，并让当前所在区块对应的导航项显示 active 状态。" },
      { id: "navigation-5", name: "标签切换", en: "Tabs", desc: "同区域一次看一个视图", emoji: "🗂️", prompt: "在浩然的作品区添加 Tabs，标签为 All、Web、AI、Experiments，默认显示 All；切换标签时只更新下方项目网格，不刷新整个页面；使用 tablist、tab 和 tabpanel 语义，支持左右方向键切换并显示清晰 active 状态。" },
      { id: "navigation-6", name: "侧边导航", en: "Sidebar Navigation", desc: "入口多、层级深用它", emoji: "📑", prompt: "为浩然的创作后台添加 Sidebar Navigation，包含 Overview、Projects、Posts、Media、Analytics 和 Settings，当前页面使用绿色背景和图标强调，二级菜单允许折叠；桌面端固定显示，手机端收起为 Drawer。" },
      { id: "navigation-7", name: "超级菜单", en: "Mega Menu", desc: "多列大菜单 + 预览", emoji: "🗄️", prompt: "浩然网站的 Work 导航项使用 Mega Menu，展开后显示 Projects、Experiments、Resources 三列，并在右侧增加一个 Featured Project 预览；菜单通过点击打开，不依赖 hover，支持键盘导航和 Esc 关闭，手机端改为 Accordion Menu。" },
      { id: "navigation-8", name: "底部导航", en: "Bottom Navigation", desc: "手机底部 3-5 个入口", emoji: "📱", prompt: "为浩然的移动端创作工具添加 Bottom Navigation，固定在屏幕底部，包含 Home、Projects、Create、Notes 和 Profile，当前项使用绿色填充图标，并考虑 iPhone safe-area-inset-bottom；桌面端不显示该组件。" },
      { id: "navigation-9", name: "分页", en: "Pagination", desc: "长列表拆成多页", emoji: "🔢", prompt: "为浩然的 Journal 文章列表添加 Pagination，每页显示 10 篇文章，底部显示 Previous、页码和 Next，当前页具有明显状态，并在 URL 查询参数中保存页码，例如 ?page=2；按钮使用真实链接，便于刷新、分享和返回。" },
      { id: "navigation-10", name: "返回顶部", en: "Back to Top", desc: "一键回到开头", emoji: "⬆️", prompt: "为浩然的长篇文章页添加 Back to Top 按钮，滚动超过 800px 后淡入显示并固定在右下角，点击后返回页面顶部；按钮提供 aria-label=\"返回顶部\"，并在 reduced motion 模式下取消平滑动画。" }
    ]
  },
  {
    id: "components",
    name: "常用组件",
    emoji: "🧩",
    items: [
      { id: "components-1", name: "模态框", en: "Modal", desc: "覆盖页面，先处理再走", emoji: "🪟", prompt: "浩然网站点击 Contact 后打开 Modal，Modal 内包含姓名、邮箱、项目类型和留言；打开时把键盘焦点移动到标题或第一个输入框，关闭后把焦点返回触发按钮；使用原生 dialog 和 showModal()，支持 Esc 关闭，并阻止背景内容被键盘访问。" },
      { id: "components-2", name: "抽屉", en: "Drawer", desc: "侧边滑出的面板", emoji: "📥", prompt: "浩然的项目列表点击卡片后，从右侧打开一个 Project Detail Drawer，桌面端宽度为 420px，显示封面、简介、技术栈和访问链接；页面主体仍然可见但不可操作，手机端让 Drawer 从底部打开并接近全屏。" },
      { id: "components-3", name: "手风琴", en: "Accordion", desc: "点标题展开收起", emoji: "🪗", prompt: "为浩然的 FAQ 创建 Accordion，每个标题使用 button，右侧显示加号或箭头，展开时更新 aria-expanded，并通过 aria-controls 关联内容面板；同一时间只展开一个项目，动画控制在 200ms 左右。" },
      { id: "components-4", name: "气泡提示", en: "Tooltip", desc: "悬停冒出一句说明", emoji: "💬", prompt: "在浩然的项目卡片图标上添加 Tooltip，鼠标 hover 或键盘 focus 时显示，内容控制在一句话以内，Tooltip 不获得独立焦点，离开触发元素或按 Esc 后消失；不要只支持 hover，触屏设备需要提供可理解的替代方式。" },
      { id: "components-5", name: "轻提示", en: "Toast", desc: "角落短暂的状态消息", emoji: "🔔", prompt: "浩然后台保存文章后，在右上角显示 Success Toast“文章已保存”，Toast 包含状态图标、文字和关闭按钮，4 秒后自动消失；错误 Toast 不要快速自动消失，并提供重试操作；使用 aria-live 向辅助技术宣布状态。" },
      { id: "components-6", name: "轮播图", en: "Carousel", desc: "有限空间轮流展示", emoji: "🎠", prompt: "在浩然首页添加 Featured Projects Carousel，一次展示 1 个主项目和下一项目的一小部分预览，提供 Previous、Next 按钮和 01 / 05 序号；默认不自动播放，支持触摸滑动和键盘操作，用户启用 reduced motion 时取消滑行动画。" },
      { id: "components-7", name: "图片灯箱", en: "Lightbox", desc: "点缩略图放大原图", emoji: "🔍", prompt: "为浩然的 AI Gallery 添加 Lightbox，点击缩略图后全屏显示原图，支持左右切换、Esc 关闭和图片标题，打开后锁定背景滚动；缩略图使用 button 或 link 触发，所有图片提供准确的 alt 文本。" },
      { id: "components-8", name: "表单", en: "Form", desc: "完成联系/订阅/登录", emoji: "📝", prompt: "为浩然的 Contact 页面创建一个可访问的联系表单，字段包括 Name、Email、Project Type、Budget Range 和 Message；每个输入框都有可见 label，必填项和错误信息清晰，提交中显示 loading 状态，成功后显示 Toast，并在确认提交成功前保留用户输入内容。" },
      { id: "components-9", name: "命令面板", en: "Command Palette", desc: "快捷键弹出的搜索面板", emoji: "⌨️", prompt: "为浩然的网站添加 Command Palette，用户按 Command+K 或 Ctrl+K 后打开，可以搜索并执行 Go to Work、Open About、Read Journal、Toggle Theme 和 Contact 浩然；支持上下方向键选择、Enter 执行、Esc 关闭，并按页面与操作分组显示结果。" },
      { id: "components-10", name: "悬浮按钮", en: "Floating Action Button", desc: "角落固定的主操作", emoji: "➕", prompt: "在浩然的项目后台右下角添加 Floating Action Button，使用加号图标并固定在视口右下角，点击后展开 New Project、New Post 和 Upload Image 三个快捷操作；按钮不能遮挡底部导航或重要内容，并考虑移动端安全区域。" }
    ]
  },
  {
    id: "motion",
    name: "滚动与动作",
    emoji: "🎬",
    items: [
      { id: "motion-1", name: "滚动出现", en: "Scroll Reveal", desc: "淡入 + 上移 16px", emoji: "✨", prompt: "为浩然的个人网站添加 Scroll Reveal，标题、正文、项目卡片进入视口时淡入并向上移动 16px，动画时长控制在 400—600ms；同一组卡片使用轻微错峰，不要让整页所有元素同时动画；用户启用 prefers-reduced-motion 时取消位移动画，只保留即时显示或轻微淡入。" },
      { id: "motion-2", name: "视差滚动", en: "Parallax", desc: "前中背景不同速度", emoji: "🏔️", prompt: "为浩然的首页 Hero 添加轻量 Parallax，背景抽象山形移动速度最慢，中层半透明网页面板使用中等速度，前景标题保持接近正常滚动速度；移动距离控制在较小范围，禁止大幅缩放和快速位移；移动端降低效果，reduced motion 模式下完全关闭视差。" },
      { id: "motion-3", name: "阅读进度条", en: "Scroll Progress", desc: "顶部细线反映进度", emoji: "📏", prompt: "在浩然的长篇文章页顶部添加 Scroll Progress Indicator，使用 3px 深绿色进度线，从左向右反映当前阅读百分比；导航栏保持 Sticky，进度条位于导航底部；不要遮挡内容，并使用 requestAnimationFrame 或 CSS Scroll-driven Animation 实现平滑更新。" },
      { id: "motion-4", name: "滚动吸附", en: "Scroll Snap", desc: "滚动后自动对齐", emoji: "🧲", prompt: "为浩然的精选作品区添加 CSS Scroll Snap，横向容器使用 scroll-snap-type: x mandatory，每个项目卡片使用 scroll-snap-align: center；允许触摸滑动和触控板滚动，保留自然惯性；不要劫持整个页面滚动，桌面端同时提供上一项和下一项按钮。" },
      { id: "motion-5", name: "横向滚动", en: "Horizontal Scroll", desc: "沿水平方向浏览", emoji: "↔️", prompt: "为浩然的项目档案创建 Horizontal Scroll，桌面端展示 3.5 张卡片，让下一张卡片露出一部分作为继续浏览提示；支持触控板和触摸滑动，并提供左右箭头；卡片保持键盘可聚焦，手机端使用自然横向滚动。" },
      { id: "motion-6", name: "无限滚动", en: "Infinite Scroll", desc: "到底自动加载下一批", emoji: "♾️", prompt: "为浩然的 AI 灵感流实现 Infinite Scroll，每次加载 12 个项目，在列表底部设置 sentinel，并使用 IntersectionObserver 在 sentinel 接近视口时请求下一页；加载期间显示 Skeleton；加载失败时显示 Retry 按钮；保存滚动位置，避免返回页面时丢失当前位置。" },
      { id: "motion-7", name: "跑马灯", en: "Marquee", desc: "内容持续横向移动", emoji: "🎪", prompt: "在浩然首页的 Hero 下方添加一个循环 Marquee，内容为 Design、Frontend、AI Prototyping、Writing、Creative Tools；两组内容无缝衔接，移动速度缓慢；鼠标悬停时暂停；内容必须在动画关闭时仍可阅读，reduced motion 模式下改为普通换行标签列表。" },
      { id: "motion-8", name: "悬停微交互", en: "Hover Micro-interaction", desc: "确认“这个可以点”", emoji: "🖱️", prompt: "为浩然的项目卡片添加 Hover Micro-interaction，鼠标进入时卡片上移 4px，边框由浅灰变为深绿色，封面图轻微放大到 1.03，右下角箭头向右移动 4px；动画使用 180—240ms ease-out；键盘 focus-visible 状态提供同等清晰反馈，不要只依赖 hover。" },
      { id: "motion-9", name: "错峰动画", en: "Staggered Animation", desc: "同组元素依次进入", emoji: "🎞️", prompt: "为浩然的四张能力卡片添加 Staggered Entrance，第一张进入视口后开始动画，其余卡片每隔 70ms 依次淡入并上移 12px；总等待时间不要超过 300ms；重复滚动时不要反复播放；reduced motion 模式下让所有卡片直接显示。" },
      { id: "motion-10", name: "滚动驱动", en: "Scroll-driven Animation", desc: "动画进度由滚动决定", emoji: "🎥", prompt: "在浩然的项目案例页使用 Scroll-driven Animation，滚动经过 Process 章节时，左侧进度线随章节阅读进度增长，右侧三个原型面板依次从低透明度变为完全可见；优先使用 CSS animation-timeline 和 view()，为不支持的浏览器提供 IntersectionObserver 降级方案，并尊重 reduced motion。" }
    ]
  },
  {
    id: "feedback",
    name: "提示与加载",
    emoji: "⏳",
    items: [
      { id: "feedback-1", name: "骨架屏", en: "Skeleton Screen", desc: "灰色占位，减少跳动", emoji: "🦴", prompt: "为浩然的项目列表设计 Skeleton Screen，骨架结构必须与最终卡片尺寸一致，包含封面占位、标题线、两行文字和标签占位；使用低对比度灰绿色，不要显示虚假文字；内容加载完成后使用短暂淡入替换，避免布局位移。" },
      { id: "feedback-2", name: "懒加载", en: "Lazy Loading", desc: "接近视口才加载", emoji: "🐢", prompt: "为浩然的作品集实现 Lazy Loading，首屏 Hero 图片正常加载，不要设置 lazy；首屏以下的 img 和 iframe 使用 loading=\"lazy\"；为图片预先设置 width、height 或 aspect-ratio，避免布局跳动；重要项目封面提供合适的 srcset 和 sizes，不要把所有资源都延迟加载。" },
      { id: "feedback-3", name: "加载转圈", en: "Loading Spinner", desc: "短请求的循环图标", emoji: "⏳", prompt: "浩然网站提交短请求时显示 Loading Spinner，Spinner 只出现在正在更新的局部区域，不要遮罩整个页面；同时显示“正在加载项目”文字；超过 8 秒后追加更明确的等待说明和取消入口；动画在 reduced motion 模式下改为静态状态图标。" },
      { id: "feedback-4", name: "进度条", en: "Progress Bar", desc: "0-100% 建立预期", emoji: "📈", prompt: "为浩然的 AI 图片导出任务添加 Determinate Progress Bar，显示 0—100% 进度、当前阶段名称和取消按钮；进度条只向前移动，不要伪造倒退；完成后切换为 Success State，失败后保留当前进度并显示 Retry；使用 role=\"progressbar\" 提供可访问状态。" },
      { id: "feedback-5", name: "加载按钮", en: "Loading Button", desc: "提交后按钮变处理中", emoji: "🔘", prompt: "浩然的联系表单点击 Send Message 后，把按钮切换为 Loading Button：禁用重复提交，文字改为“Sending…”并显示小型 Spinner；保持按钮宽度不变，避免界面跳动；请求成功后显示“Sent”，失败后恢复可点击状态并显示错误原因。" },
      { id: "feedback-6", name: "空状态", en: "Empty State", desc: "没内容时给下一步", emoji: "📭", prompt: "为浩然的新项目页面设计 Empty State，中心显示一个简洁抽象图形、标题“还没有项目”、一句说明和“创建第一个项目”按钮；如果是筛选导致无结果，改为“没有匹配的项目”，并提供清除筛选按钮；不要使用消极或责备用户的文案。" },
      { id: "feedback-7", name: "错误状态", en: "Error State", desc: "说清原因 + 重试", emoji: "⚠️", prompt: "为浩然的项目加载失败设计 Error State，显示清晰标题“项目暂时无法加载”、简短原因、Retry 按钮和返回项目列表链接；保留已经加载的其他内容，不要清空整个页面；错误信息使用图标、文字和颜色共同表达，并通过 role=\"alert\" 或合适的 live region 通知辅助技术。" },
      { id: "feedback-8", name: "重试状态", en: "Retry State", desc: "失败后单独重试", emoji: "🔁", prompt: "浩然的图片上传失败后显示 Retry State，保留失败文件的缩略图和文件名，标出“上传失败”，提供 Retry 和 Remove 两个操作；点击 Retry 后只重新上传该文件，并切换为进度状态；成功后替换为完成状态，不要要求用户重新选择所有文件。" },
      { id: "feedback-9", name: "乐观更新", en: "Optimistic UI", desc: "先假设成功，再后台请求", emoji: "⚡", prompt: "浩然的项目收藏按钮使用 Optimistic UI，点击后立刻把图标切换为已收藏并更新计数，同时后台发送请求；请求失败时恢复原状态，显示非阻塞错误提示并提供重试；不要把支付、删除账号等不可逆或高风险操作做成乐观更新。" },
      { id: "feedback-10", name: "行内验证", en: "Inline Validation", desc: "输入时在字段旁提示", emoji: "✅", prompt: "为浩然的 Contact Form 添加 Inline Validation，邮箱字段在 blur 后检查格式，错误信息显示在输入框下方并说明如何修正；输入正确后显示简洁确认状态；不要在用户输入第一个字符时立刻报错；提交失败时把焦点移动到第一个错误字段，并在顶部提供错误摘要。" }
    ]
  },
  {
    id: "style",
    name: "视觉风格",
    emoji: "🎨",
    items: [
      { id: "style-1", name: "极简主义", en: "Minimalism", desc: "留白 + 字体层级，少即是多", emoji: "⬜", prompt: "为浩然设计一个 Minimalist Portfolio，使用米白背景、黑色正文和单一深绿色强调色，限制字体、圆角和阴影种类；首页只保留姓名、身份、精选项目和联系入口；通过大留白和清晰排版建立层级，不要加入多余渐变、发光效果或装饰图标。" },
      { id: "style-2", name: "编辑杂志风", en: "Editorial Design", desc: "像一本独立杂志", emoji: "📰", prompt: "为浩然的 Journal 设计 Editorial Layout，使用超大文章标题、窄正文栏、跨栏图片、章节编号、首字下沉和 pull quote；正文保持舒适行长和行高；不要把每段内容都放进卡片，让页面更接近现代独立杂志。" },
      { id: "style-3", name: "瑞士风", en: "Swiss Style", desc: "严格网格，理性精确", emoji: "🇨🇭", prompt: "为浩然的作品索引使用 Swiss Style，采用严格的 12 列网格、左对齐无衬线字体、明显编号和细分隔线；颜色仅使用米白、黑和深绿色；项目信息按年份、类别和角色对齐排列，避免装饰性手写字体与复杂阴影。" },
      { id: "style-4", name: "玻璃拟态", en: "Glassmorphism", desc: "半透明玻璃悬浮感", emoji: "🧊", prompt: "为浩然的 AI 工具首页添加克制的 Glassmorphism，深绿色抽象背景上叠加两到三层半透明面板，使用 backdrop-filter: blur(16px)、低透明白色背景和细亮边框；正文区域保持高对比度，不要让所有卡片都透明，也不要使用过度霓虹发光。" },
      { id: "style-5", name: "新野兽派", en: "Neo-brutalism", desc: "粗边框 + 硬阴影，原始感", emoji: "🟥", prompt: "为浩然的实验项目页使用 Neo-brutalist Style，采用粗黑边框、硬阴影、大字号标题和深绿色重点按钮；组件保持清晰网格与可读性，避免装饰性手写字体与复杂阴影。" },
      { id: "style-6", name: "深色模式", en: "Dark Mode", desc: "深底浅字，降低强光", emoji: "🌙", prompt: "为浩然网站实现完整 Dark Mode，使用 prefers-color-scheme 读取系统偏好，并提供手动切换和本地保存；深色背景避免纯黑，正文使用柔和浅灰，深绿色调整为更亮的可见色；表单、滚动条和原生控件同步 color-scheme；检查两种模式下的对比度和图片表现。" },
      { id: "style-7", name: "单色与双色", en: "Monochrome / Duotone", desc: "一两种颜色控全场", emoji: "⚫", prompt: "为浩然的个人网站使用 Monochrome + Duotone 视觉系统，全站以米白、黑和深绿色构成，项目图片转换为低饱和绿色双色调，鼠标悬停后恢复少量原色；保证文字、边框和按钮层级清楚，不要让所有元素使用相同深浅。" },
      { id: "style-8", name: "网格渐变", en: "Gradient Mesh", desc: "柔和色块交融的空间感", emoji: "🌈", prompt: "为浩然首页 Hero 创建低饱和 Gradient Mesh 背景，使用米白、灰绿和深绿色的柔和色团，边缘模糊并缓慢漂移；文字区域保持相对平静，确保标题对比度；动画幅度很小，移动端使用静态背景，reduced motion 模式下关闭。" },
      { id: "style-9", name: "颗粒与噪点", en: "Grain / Noise Texture", desc: "细颗粒的印刷质感", emoji: "📺", prompt: "在浩然网站的米白背景和深绿色 Hero 上添加非常轻的 Grain Texture，噪点透明度保持低，使用可重复的小型纹理或 CSS/SVG filter，不影响文字清晰度；不要给表单和正文区域增加明显颗粒；移动端控制纹理资源大小，避免使用超大背景图片。" },
      { id: "style-10", name: "新拟态", en: "Neumorphism / Soft UI", desc: "同色亮暗阴影，凸起凹下", emoji: "🫧", prompt: "为浩然的实验性音乐控制器使用局部 Neumorphism，仅对播放、音量和模式按钮使用同色亮暗阴影，保留清晰文字、图标和 focus outline；主要导航、表单与长文本不要使用新拟态；按下状态需要通过阴影、位置和颜色共同表达。" }
    ]
  },
  {
    id: "effects",
    name: "高级效果",
    emoji: "✨",
    items: [
      { id: "effects-1", name: "自定义光标", en: "Custom Cursor", desc: "光标变成绿色圆点", emoji: "🎯", prompt: "为浩然的桌面作品画廊添加 Custom Cursor，默认显示小型绿色圆点，悬停项目图片时扩展并显示“View”，进入横向画廊时显示“Drag”；保留原生光标作为可用后备，触屏设备不启用；不要让自定义光标产生明显延迟，也不要遮挡表单与正文。" },
      { id: "effects-2", name: "磁吸按钮", en: "Magnetic Button", desc: "光标靠近，按钮被吸引", emoji: "🧿", prompt: "为浩然首页的 View Work 按钮添加轻量 Magnetic Effect，只有当光标距离按钮较近时，按钮内容最多偏移 6px，鼠标离开后快速回到原位；按钮本身不能逃离点击区域；触屏和 reduced motion 模式下关闭磁吸，只保留普通 hover 状态。" },
      { id: "effects-3", name: "3D 倾斜卡片", en: "3D Tilt Card", desc: "随光标轻微旋转", emoji: "🃏", prompt: "为浩然的 Featured Project 卡片添加 3D Tilt，光标移动时 rotateX 和 rotateY 最大不超过 5deg，封面、文字和高光使用很小的 Z 轴层次；鼠标离开后平滑归位；移动端和 reduced motion 模式关闭倾斜，卡片点击区域保持稳定。" },
      { id: "effects-4", name: "聚光灯悬停", en: "Spotlight Hover", desc: "局部柔光斑突出区域", emoji: "🔦", prompt: "在浩然的深色功能网格上添加 Spotlight Hover，使用鼠标位置控制径向渐变，光斑范围只覆盖当前卡片附近，亮度克制；焦点进入卡片时提供静态高亮替代；不要使用持续追踪的强烈发光，也不要降低文字对比度。" },
      { id: "effects-5", name: "文字蒙版", en: "Image / Text Mask", desc: "图片只显示在文字内", emoji: "🔤", prompt: "为浩然首页标题“MAKE IDEAS VISIBLE”添加 Text Mask，低饱和抽象动画只显示在文字内部；在不支持 background-clip: text 的环境中回退为深绿色实心文字；标题必须保持可选择、可读和语义化，不要把重要文字只做成图片。" },
      { id: "effects-6", name: "裁切揭示", en: "Clip-path Reveal", desc: "像幕布打开一样展开", emoji: "✂️", prompt: "为浩然的项目封面添加 Clip-path Reveal，图片进入视口时从 inset(0 100% 0 0) 过渡到完整显示，持续 500ms；动画只播放一次；为不支持或 reduced motion 用户直接显示完整图片；不要同时叠加大幅位移和缩放。" },
      { id: "effects-7", name: "WebGL", en: "WebGL Hero", desc: "GPU 渲染实时 3D", emoji: "🌐", prompt: "为浩然的首页制作一个轻量 Three.js Hero，场景包含一个低多边形抽象球体和三层半透明界面平面，跟随鼠标产生非常轻微视差；限制几何体数量、纹理尺寸和像素比；页面隐藏时暂停渲染；移动端使用简化场景，低性能或 WebGL 不可用时显示静态海报图。" },
      { id: "effects-8", name: "视图过渡", en: "View Transitions", desc: "新旧内容平滑衔接", emoji: "🔀", prompt: "浩然的项目卡片点击后使用 View Transition 进入详情页，卡片封面与详情页 Hero 共享 view-transition-name，让图片从卡片位置自然扩展；过渡控制在 300—450ms；浏览器不支持时正常导航；不要让过渡影响焦点、阅读位置或返回按钮行为，并在 reduced motion 下跳过动画。" },
      { id: "effects-9", name: "减少动态", en: "Reduced Motion", desc: "尊重系统减动效", emoji: "♿", prompt: "为浩然网站完整支持 prefers-reduced-motion: reduce，关闭 Parallax、磁吸按钮、3D Tilt、自动 Marquee 和大范围页面过渡；Scroll Reveal 改为直接显示或短淡入；Carousel 停止自动播放；所有功能仍可操作，不能因为关闭动画而隐藏内容或丢失状态反馈。" },
      { id: "effects-10", name: "性能预算", en: "Performance Budget", desc: "给效果设上限", emoji: "⚖️", prompt: "为浩然的个人网站制定 Performance Budget：移动端首屏 JavaScript 尽量控制在 170KB gzip 以内，首屏关键图片使用现代格式并严格压缩，WebGL 场景延迟到需要时加载，字体不超过两个家族和必要字重；在 CI 中运行 Lighthouse 或等价检查，超过预算时提示优化，不要为了动画牺牲核心内容加载。" }
    ]
  }
];
