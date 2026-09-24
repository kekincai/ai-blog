/**
 * 樱花树下，苍鹭骑自行车。
 *
 * 移植自 sakura-heron-astra.html：同一套 SVG 图形与动画（腿按固定骨长反解膝盖，双脚始终踩在踏板上）。
 * 这里输出 SVG 字符串，服务端、浏览器、构建脚本都能用：
 *   - detail "full"：原网页的完整场景（README 插图）
 *   - detail "wide"：同一个场景，远景（天空、远山、河、路）向两侧镜像延伸，用于又矮又宽的首页页头
 *   - detail "icon"：网站图标，只有苍鹭、自行车和几朵花
 * 动画由 animateHeronScene() 直接改 SVG 属性驱动，与原页面一致。
 *
 * 本文件不能 import 其他模块：scripts/export-heron.mjs 会用 Node 直接加载它。
 */

export type Detail = "full" | "wide" | "icon";

type Options = {
  /** 所有 id 的前缀，同一页面上出现多次时避免冲突 */
  id: string;
  detail: Detail;
};

export const VIEWBOX: Record<Detail, string> = {
  full: "0 0 1440 960",
  wide: "-480 190 2400 600",
  icon: "440 300 470 470",
};

const COLORS = ["#f9e5de", "#f2d6d0", "#edc4c2", "#f8dfd6", "#e6b2b7", "#fff0e3"];
const PETAL = "M0 0C-8-3-10-11-4-13Q-1-14 1-10Q5-12 7-8C9-3 4 1 0 0Z";
const LEFT_CROWN: [number, number, number][] = [[25, 55, 142], [171, 35, 130], [290, 43, 96], [385, 62, 106], [467, 104, 83], [326, 155, 98], [206, 178, 108], [84, 216, 117], [347, 235, 87], [438, 214, 64], [22, 315, 99], [159, 307, 61]];
const RIGHT_CROWN: [number, number, number][] = [[1410, 35, 152], [1274, 44, 119], [1149, 36, 103], [1035, 93, 106], [949, 119, 70], [1167, 185, 110], [1301, 219, 104], [1416, 247, 110], [1096, 252, 97], [997, 249, 64], [1387, 341, 88]];

/** 可复现的伪随机数（与原页面同一个种子），服务端和浏览器生成的画面完全一致 */
function lcg(seed = 2917) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/* ---------------- 姿态：腿、曲柄、车轮、围巾 ---------------- */

/** 按髋部和踏板位置解出膝盖，返回大腿、小腿、脚的 transform */
function leg(angle: number, hipX: number, hipY: number) {
  const px = 700 + Math.cos(angle) * 35;
  const py = 684 + Math.sin(angle) * 35;
  const dx = px - hipX, dy = py - hipY;
  const distance = Math.hypot(dx, dy);
  const along = (108 * 108 - 104 * 104 + distance * distance) / (2 * distance);
  const height = Math.sqrt(Math.max(0, 108 * 108 - along * along));
  const kneeX = hipX + (along * dx) / distance + (height * dy) / distance;
  const kneeY = hipY + (along * dy) / distance - (height * dx) / distance;
  const deg = 180 / Math.PI;
  return {
    thigh: `translate(${r2(hipX)} ${r2(hipY)}) rotate(${r2(Math.atan2(kneeY - hipY, kneeX - hipX) * deg)})`,
    shin: `translate(${r2(kneeX)} ${r2(kneeY)}) rotate(${r2(Math.atan2(py - kneeY, px - kneeX) * deg)})`,
    foot: `translate(${r2(px)} ${r2(py)})`,
  };
}

/** t 秒时各部件的 transform */
function pose(t: number) {
  const angle = (t * Math.PI * 2) / 2.4;
  const bob = Math.sin(angle * 2) * 1.6;
  const far = leg(angle + Math.PI, 667, 533 + bob);
  const near = leg(angle, 650, 535 + bob);
  return {
    heron: `translate(0 ${r2(bob)})`,
    scarf: `rotate(${r2(Math.sin(t * 3) * 3)} 724 416)`,
    "far-thigh": far.thigh, "far-shin": far.shin, "far-foot": far.foot,
    "near-thigh": near.thigh, "near-shin": near.shin, "near-foot": near.foot,
    crank: `rotate(${r2((angle * 180) / Math.PI)})`,
    "rear-spokes": `rotate(${r2(t * 112)})`,
    "front-spokes": `rotate(${r2(t * 112)})`,
    "left-tree": `rotate(${r2(Math.sin(t * 0.55) * 0.22)} 70 790)`,
    "right-tree": `rotate(${r2(Math.sin(t * 0.55 + 1.5) * 0.22)} 1410 810)`,
  } as Record<string, string>;
}

/* ---------------- 随机元素：花冠、地面、花瓣 ---------------- */

type Mark = { x: number; y: number; rx: number; ry: number; fill: string };
type Petal = { x: number; y: number; speed: number; phase: number; size: number; front: boolean; fill: string };

function generate(detail: Detail) {
  const random = lcg();
  const density = detail === "icon" ? 0 : 0.55;

  const crown = (clusters: [number, number, number][]) => {
    const clouds: string[] = [], flowers: string[] = [];
    for (const [x, y, radius] of clusters) {
      clouds.push(`<ellipse cx="${x}" cy="${y}" rx="${radius}" ry="${r2(radius * 0.68)}" fill="#edceca" opacity=".58"/>`);
      for (let n = 0; n < radius * density; n++) {
        const a = random() * Math.PI * 2, d = Math.sqrt(random()) * radius;
        const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * 0.68;
        const rot = random() * 72, scale = 0.4 + random() * 0.55;
        const color = COLORS[Math.floor(random() * COLORS.length)], op = 0.78 + random() * 0.22;
        flowers.push(`<use href="#{id}-blossom" transform="translate(${r2(px)} ${r2(py)}) rotate(${r2(rot)}) scale(${r2(scale)})" color="${color}" opacity="${r2(op)}"/>`);
      }
    }
    return { clouds: clouds.join(""), flowers: flowers.join("") };
  };

  const left = crown(LEFT_CROWN);
  const right = crown(RIGHT_CROWN);

  const distant: string[] = [];
  if (detail !== "icon") {
    for (let n = 0; n < 70; n++) {
      const side = n % 2;
      distant.push(`<use href="#{id}-blossom" transform="translate(${r2((side ? 1090 : 328) + (random() - 0.5) * 140)} ${r2(475 + (random() - 0.5) * 64)}) scale(${r2(0.2 + random() * 0.2)})" color="${COLORS[n % COLORS.length]}"/>`);
    }
  }

  const marks: Mark[] = [];
  const { span } = RANGE[detail];
  const markCount = detail === "icon" ? 0 : Math.round((36 * span) / 1600);
  for (let n = 0; n < markCount; n++) {
    marks.push({ x: random() * span, y: 775 + random() * 75, rx: 1 + random() * 4, ry: 1 + random() * 1.5, fill: n % 3 ? "#b5ad91" : "#d4a6a3" });
  }

  const petals: Petal[] = [];
  const petalCount = detail === "icon" ? 0 : Math.round((40 * span) / 1600);
  for (let n = 0; n < petalCount; n++) {
    const front = n % 3 === 0;
    const x = random() * (span - 100);
    petals.push({ x, y: random() * 1050, speed: 20 + random() * 23, phase: random() * Math.PI * 2, size: front ? 0.85 + random() * 0.5 : 0.45 + random() * 0.45, front, fill: COLORS[n % COLORS.length] });
  }

  return { left, right, distant: distant.join(""), marks, petals };
}

/** 花瓣、地面小点循环移动的横向范围：原场景 1600 宽（-80 起）；wide 向两侧各延伸 480 */
const RANGE: Record<Detail, { span: number; base: number }> = {
  full: { span: 1600, base: -80 },
  wide: { span: 2560, base: -560 },
  icon: { span: 1600, base: -80 },
};

function markTransform(m: Mark, t: number, detail: Detail) {
  const { span, base } = RANGE[detail];
  return `translate(${r2((((m.x - t * 174) % span) + span) % span + base)} ${r2(m.y)})`;
}

function petalTransform(p: Petal, t: number, detail: Detail) {
  const { span, base } = RANGE[detail];
  const y = ((p.y + t * p.speed) % 1050) - 65;
  const x = ((((p.x - t * 21 + Math.sin(t * 0.8 + p.phase) * 22) % span) + span) % span) + base;
  const turn = t * 48 + p.phase * 60;
  const flutter = 0.45 + Math.abs(Math.sin(t * 1.8 + p.phase)) * 0.55;
  return `translate(${r2(x)} ${r2(y)}) rotate(${r2(turn)}) scale(${r2(p.size * flutter)} ${r2(p.size)})`;
}

/* ---------------- SVG 字符串 ---------------- */

const DEFS = `
<linearGradient id="{id}-sky" x2="0" y2="1"><stop stop-color="#e6eae0"/><stop offset=".65" stop-color="#fcf0db"/><stop offset="1" stop-color="#f0e5cd"/></linearGradient>
<linearGradient id="{id}-water" x2="0" y2="1"><stop stop-color="#bccdc2"/><stop offset="1" stop-color="#d3d8bf"/></linearGradient>
<linearGradient id="{id}-road" x2="0" y2="1"><stop stop-color="#dfd7bd"/><stop offset="1" stop-color="#f1e8d7"/></linearGradient>
<linearGradient id="{id}-body" x1="0" y1="0" x2=".65" y2="1"><stop stop-color="#abbcc0"/><stop offset=".6" stop-color="#7a929a"/><stop offset="1" stop-color="#556f7c"/></linearGradient>
<linearGradient id="{id}-wing" x2=".8" y2="1"><stop stop-color="#718c99"/><stop offset="1" stop-color="#435f70"/></linearGradient>
<linearGradient id="{id}-neck" x1="0" x2="1"><stop stop-color="#a0b1b1"/><stop offset=".6" stop-color="#e5e7db"/><stop offset="1" stop-color="#f4f0df"/></linearGradient>
<radialGradient id="{id}-light"><stop stop-color="#fff9df" stop-opacity=".7"/><stop offset="1" stop-color="#fff9df" stop-opacity="0"/></radialGradient>
<filter id="{id}-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="12"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".07"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
<g id="{id}-blossom">
  <path d="M0 0C-13-6-14-18-6-20Q-2-21 0-17Q3-22 7-20C15-17 12-5 0 0" fill="currentColor"/>
  <path d="M0 0C-13-6-14-18-6-20Q-2-21 0-17Q3-22 7-20C15-17 12-5 0 0" fill="currentColor" transform="rotate(72)"/>
  <path d="M0 0C-13-6-14-18-6-20Q-2-21 0-17Q3-22 7-20C15-17 12-5 0 0" fill="currentColor" transform="rotate(144)"/>
  <path d="M0 0C-13-6-14-18-6-20Q-2-21 0-17Q3-22 7-20C15-17 12-5 0 0" fill="currentColor" transform="rotate(216)"/>
  <path d="M0 0C-13-6-14-18-6-20Q-2-21 0-17Q3-22 7-20C15-17 12-5 0 0" fill="currentColor" transform="rotate(288)"/>
  <g stroke="#bf7881" stroke-width="1" opacity=".7"><path d="M0 0L-2-8M0 0L7-3M0 0L5 6M0 0L-5 5M0 0L-8-3"/></g>
  <circle r="2.4" fill="#c59a5d"/>
</g>
<g id="{id}-spokes" stroke="#82918a" stroke-width="1.35" opacity=".8">
  <path d="M-80 0H80M0-80V80M-56.57-56.57L56.57 56.57M56.57-56.57L-56.57 56.57M-30.61-73.91L30.61 73.91M30.61-73.91L-30.61 73.91M-73.91-30.61L73.91 30.61M-73.91 30.61L73.91-30.61"/>
  <circle cx="0" cy="-80" r="3" fill="#eed6ac" stroke="none"/>
</g>
<g id="{id}-wheel"><circle r="89" fill="none" stroke="#344a48" stroke-width="10"/><circle r="83" fill="none" stroke="#f0dfb8" stroke-width="3"/><circle r="79" fill="none" stroke="#718980" stroke-width="1.5"/></g>`;

const LANDSCAPE = `
<rect width="1440" height="960" fill="url(#{id}-sky)"/>
<circle cx="813" cy="291" r="80" fill="#fff7df" opacity=".85"/>
<ellipse cx="784" cy="390" rx="430" ry="300" fill="url(#{id}-light)"/>
<path d="M0 501Q117 380 268 450T545 444Q692 353 846 436T1157 423Q1318 373 1440 444V673H0Z" fill="#cdd3bf" opacity=".57"/>
<path d="M0 530Q134 459 273 502T573 497T884 506T1147 478T1440 507V651H0Z" fill="#b2c4b3" opacity=".52"/>
<g fill="#9fb4a5" opacity=".38"><path d="M254 533l14-68 13 68Zm32 5 17-91 18 91Zm813-12 17-89 17 89Zm39 0 12-63 13 63Z"/></g>
<path d="M0 556Q290 539 588 551T1101 544T1440 552V675H0Z" fill="url(#{id}-water)"/>
<g stroke="#f4edda" stroke-linecap="round" opacity=".5" fill="none">
  <path d="M361 571h107m-26 13h66m363-12h106m-75 18h126M211 607h55m777-4h114M393 623h142"/>
  <path d="M767 552h95m-74 8h52m-39 41h100" stroke-width="3"/>
</g>
<path d="M0 629Q176 595 384 635Q590 666 884 621Q1142 589 1440 625V800H0Z" fill="#a9b7a1"/>
<path d="M0 666Q240 614 508 661T1025 653T1440 646V822H0Z" fill="#c0c6a7"/>
<path d="M0 744Q314 700 660 733T1440 721V960H0Z" fill="url(#{id}-road)"/>
<path d="M0 746Q314 702 660 735T1440 723" fill="none" stroke="#f5ead2" stroke-width="7"/>`;

const DISTANT_TREES = `
<path d="M335 642l-5-155m0 51-39-42m40 20 40-57M1076 641l16-177m-12 103-47-64m54 8 44-41" stroke="#94877a" stroke-width="8" fill="none"/>
<g fill="#e9cecb"><ellipse cx="322" cy="479" rx="79" ry="46"/><ellipse cx="369" cy="450" rx="58" ry="36"/><ellipse cx="1095" cy="465" rx="89" ry="50"/><ellipse cx="1045" cy="495" rx="52" ry="31"/></g>`;

const LEFT_TREE = `
<path d="M51 792C91 681 125 583 123 478C121 373 137 312 216 224C276 159 351 139 449 92L426 72C330 110 249 126 186 179C163 103 121 58 97 0H28C48 81 107 147 111 223C31 208-30 168-73 133L-90 169C-26 232 34 253 94 285C52 403 84 496 57 617C43 686 14 744-6 786Z" fill="#695f5b"/>
<path d="M42 765Q105 551 91 432Q92 311 153 239Q164 177 117 98" fill="none" stroke="#958278" stroke-width="13" opacity=".5"/>
<path d="M136 355Q261 303 317 223Q366 186 467 200M190 194Q269 81 375 49M292 143Q384 153 529 92M88 424Q28 355-18 356M320 222Q328 164 312 115" fill="none" stroke="#74645f" stroke-width="17" stroke-linecap="round"/>
<path d="M252 284Q348 267 420 234M365 193Q414 142 471 134M387 147Q437 178 508 161M234 124Q245 62 225 16M101 338Q25 295-33 291" fill="none" stroke="#8a7069" stroke-width="7" stroke-linecap="round"/>`;

const RIGHT_TREE = `
<path d="M1458 814Q1357 685 1335 557C1315 434 1332 343 1266 260C1191 171 1104 145 975 101L990 77Q1168 111 1234 174Q1284 96 1314-15H1386Q1361 105 1300 210Q1375 199 1450 135L1470 174Q1405 242 1331 274C1382 386 1365 481 1390 582Q1414 686 1485 768Z" fill="#70615c"/>
<path d="M1440 780Q1341 604 1353 448Q1345 325 1280 239Q1324 134 1346 60" fill="none" stroke="#aa8c7d" stroke-width="13" opacity=".35"/>
<path d="M1306 377Q1184 319 1124 260Q1032 211 924 222M1251 213Q1177 117 1137 33M1181 153Q1091 168 920 101M1357 402Q1410 346 1478 334" fill="none" stroke="#7d665e" stroke-width="17" stroke-linecap="round"/>
<path d="M1131 260Q1072 281 1005 268M1102 214Q1073 163 1089 125M1078 152Q1005 122 973 62M1210 165Q1224 82 1262 37M1295 324Q1240 330 1186 301" fill="none" stroke="#94746a" stroke-width="7" stroke-linecap="round"/>`;

function cyclist(p: Record<string, string>) {
  return `
<g data-part="cyclist">
  <ellipse cx="707" cy="775" rx="235" ry="16" fill="#656f58" opacity=".13"/>
  <g stroke="#9d8965" stroke-width="8" fill="none" stroke-linecap="round">
    <path data-part="far-thigh" d="M0 0H108" transform="${p["far-thigh"]}"/><path data-part="far-shin" d="M0 0H104" transform="${p["far-shin"]}"/>
  </g>
  <g data-part="far-foot" transform="${p["far-foot"]}"><path d="M-8-5Q4-5 15 0L28 2" fill="none" stroke="#9d8965" stroke-width="6" stroke-linecap="round"/><path d="M-13 6H17" stroke="#45594f" stroke-width="6" stroke-linecap="round"/></g>
  <g transform="translate(570 682)"><use href="#{id}-wheel"/><g data-part="rear-spokes" transform="${p["rear-spokes"]}"><use href="#{id}-spokes"/></g><circle r="8" fill="#d3b78b" stroke="#455a52" stroke-width="3"/></g>
  <g transform="translate(858 682)"><use href="#{id}-wheel"/><g data-part="front-spokes" transform="${p["front-spokes"]}"><use href="#{id}-spokes"/></g><circle r="8" fill="#d3b78b" stroke="#455a52" stroke-width="3"/></g>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M488 645A89 89 0 0 1 638 621M782 630A90 90 0 0 1 939 648" stroke="#74948a" stroke-width="5"/>
    <path d="M570 682L635 578L700 684Z M635 578L795 577L700 684M795 577L858 682" stroke="#406c63" stroke-width="11"/>
    <path d="M577 676L635 585L694 678M646 578H789M799 581L852 675" stroke="#91a698" stroke-width="2"/>
    <path d="M634 577L627 555M795 577L809 536Q815 527 836 532L854 539" stroke="#496459" stroke-width="8"/>
    <path d="M842 534l17 6" stroke="#795d47" stroke-width="10"/>
    <path d="M809 538Q768 576 824 616" stroke="#5d7061" stroke-width="2"/>
    <path d="M605 556Q631 548 654 554" stroke="#775d4f" stroke-width="13"/>
    <path d="M505 592H603M519 592L562 677" stroke="#496e61" stroke-width="5"/>
  </g>
  <path d="M573 669L699 662A22 22 0 0 1 703 705L573 694A13 13 0 0 1 573 669Z" fill="#afba9e" stroke="#516f60" stroke-width="2"/>
  <circle cx="700" cy="684" r="20" fill="#648375" stroke="#c8c7a7" stroke-width="3"/>
  <g transform="translate(700 684)"><path data-part="crank" d="M-35 0H35" stroke="#d4c9a8" stroke-width="6" stroke-linecap="round" transform="${p.crank}"/></g>
  <circle cx="700" cy="684" r="5" fill="#4d685d"/>
  <g stroke="#c6ac79" stroke-width="9" fill="none" stroke-linecap="round"><path data-part="near-thigh" d="M0 0H108" transform="${p["near-thigh"]}"/><path data-part="near-shin" d="M0 0H104" transform="${p["near-shin"]}"/></g>
  <g data-part="near-foot" transform="${p["near-foot"]}"><path d="M-9-6Q2-6 14-1L29 2M12-1L22-3" fill="none" stroke="#c6ac79" stroke-width="6" stroke-linecap="round"/><path d="M-13 6H17" stroke="#405a4e" stroke-width="6" stroke-linecap="round"/></g>
  <g data-part="heron" transform="${p.heron}">
    <path d="M575 498Q532 508 489 498L528 524L500 529Q538 542 585 527Z" fill="#3e5b6e"/>
    <path d="M579 475Q634 446 698 471Q742 488 725 519Q697 552 641 549Q585 546 549 520Z" fill="url(#{id}-body)"/>
    <path d="M686 497Q735 452 717 413Q691 360 725 334Q744 319 773 335L765 355Q741 341 738 362Q735 380 754 411Q779 458 722 516Z" fill="url(#{id}-neck)"/>
    <path d="M698 500Q749 454 729 412Q708 370 725 349" fill="none" stroke="#7e999e" stroke-width="6" opacity=".7"/>
    <path d="M743 371l5 10m4 9 4 8m3 10 3 9m0 12-1 11" fill="none" stroke="#4b6470" stroke-width="3" stroke-linecap="round"/>
    <path d="M749 323Q777 313 790 333Q783 352 756 354L728 348Q726 329 749 323Z" fill="#eef0e4"/>
    <path d="M739 327Q757 311 781 325L786 334Q760 326 745 341L721 343" fill="#2d485b"/>
    <path d="M740 330Q713 321 698 335M740 333Q714 336 701 349" fill="none" stroke="#2d485b" stroke-width="3" stroke-linecap="round"/>
    <path d="M782 333L861 343L781 346Z" fill="#c89650"/>
    <path d="M783 340L861 343L782 346Z" fill="#af7c42"/>
    <circle cx="774" cy="333" r="5" fill="#e9ce80"/><circle cx="775" cy="333" r="2.8" fill="#1f3643"/><circle cx="776" cy="332" r=".9" fill="#fff"/>
    <path d="M571 486Q622 463 685 488Q663 516 605 531L563 522L549 515Z" fill="url(#{id}-wing)"/>
    <g fill="none" stroke-linecap="round"><path d="M578 489Q621 476 657 489M571 499Q615 486 650 500M581 509Q612 499 633 507" stroke="#a5b6bb" stroke-width="4"/><path d="M603 519l26-7m-15 11 25-10" stroke="#394f62" stroke-width="3"/></g>
    <path d="M688 488Q715 497 756 498Q798 498 837 533" fill="none" stroke="#66818d" stroke-width="17" stroke-linecap="round"/>
    <path d="M695 483Q745 493 759 490Q793 493 824 522" fill="none" stroke="#b3c1bf" stroke-width="4" stroke-linecap="round"/>
    <path d="M830 530l18 7m-15-10 19 9" fill="none" stroke="#415f6e" stroke-width="5" stroke-linecap="round"/>
    <path d="M716 405Q731 413 748 406L752 417Q735 426 719 417Z" fill="#c17662"/>
    <g data-part="scarf" transform="${p.scarf}"><path d="M721 414Q685 421 671 400Q667 427 636 419Q656 442 684 433Q708 435 728 419Z" fill="#cd8970"/><path d="M648 426Q683 429 695 420" fill="none" stroke="#e2ac8c" stroke-width="3"/></g>
  </g>
</g>`;
}

/** 图标用的几朵樱花：左上、右上各一簇 */
const ICON_BLOSSOMS = [
  [470, 330, 1.5, "#edc4c2"], [505, 318, 1.1, "#f2d6d0"], [462, 372, 0.9, "#e6b2b7"],
  [880, 330, 1.4, "#e6b2b7"], [848, 316, 1, "#f9e5de"], [888, 372, 0.85, "#edc4c2"],
]
  .map(([x, y, s, c]) => `<use href="#{id}-blossom" transform="translate(${x} ${y}) scale(${s})" color="${c}"/>`)
  .join("");

/** SVG 内部内容（不含外层 <svg>），t 为初始时刻 */
export function heronSceneMarkup({ id, detail }: Options, t = 0) {
  const p = pose(t);
  const g = detail === "icon" ? null : generate(detail);
  const petalsBack = g ? g.petals.filter((x) => !x.front).map((x) => `<path data-part="petal" d="${PETAL}" fill="${x.fill}" opacity=".58" transform="${petalTransform(x, t, detail)}"/>`).join("") : "";
  const petalsFront = g ? g.petals.filter((x) => x.front).map((x) => `<path data-part="petal" d="${PETAL}" fill="${x.fill}" opacity=".85" transform="${petalTransform(x, t, detail)}"/>`).join("") : "";
  const marks = g ? g.marks.map((m) => `<ellipse data-part="mark" cx="0" cy="0" rx="${r2(m.rx)}" ry="${r2(m.ry)}" fill="${m.fill}" transform="${markTransform(m, t, detail)}"/>`).join("") : "";
  const body =
    detail === "icon"
      ? `<rect x="440" y="300" width="470" height="470" rx="84" fill="#f3eadb"/>
<path d="M440 700Q640 684 910 700V770H440Z" fill="#e7dcc4"/>
${ICON_BLOSSOMS}
${cyclist(p)}`
      : `${detail === "wide" ? `<g transform="scale(-1 1)">${LANDSCAPE}</g><g transform="translate(2880 0) scale(-1 1)">${LANDSCAPE}</g>` : ""}${LANDSCAPE}
<g fill="#b6b192" opacity=".5">${marks}</g>
<g opacity=".48">${DISTANT_TREES}${g!.distant}</g>
<g data-part="left-tree" transform="${p["left-tree"]}">${LEFT_TREE}${g!.left.clouds}${g!.left.flowers}</g>
<g data-part="right-tree" transform="${p["right-tree"]}">${RIGHT_TREE}${g!.right.clouds}${g!.right.flowers}</g>
<g>${petalsBack}</g>
${cyclist(p)}
<g fill="none" stroke="#829171" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M156 748l-6-22m6 22 11-27m-11 27-15-11M1179 744l-6-26m6 26 13-20m-13 20-19-8M225 714l-3-19m3 19 10-14M1251 751l-4-21m4 21 14-17"/></g>
<g>${petalsFront}</g>
<rect x="${detail === "wide" ? -1440 : 0}" width="${detail === "wide" ? 4320 : 1440}" height="960" fill="transparent" filter="url(#{id}-paper)" opacity=".5"/>`;
  return `<defs>${DEFS}</defs>${body}`.replaceAll("{id}", id).replace(/\n\s*/g, "");
}

/** 完整的 SVG 文件内容（图标、分享卡片用） */
export function heronSceneSVG(options: Options & { viewBox?: string; width?: number; height?: number }, t = 0) {
  const vb = options.viewBox ?? VIEWBOX[options.detail];
  const size = options.width ? ` width="${options.width}" height="${options.height ?? options.width}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${size} preserveAspectRatio="xMidYMid slice">${heronSceneMarkup(options, t)}</svg>`;
}

/** 在浏览器里让已渲染的场景从 startAt 秒开始动起来；返回的停止函数会给出停下时的时刻，方便继续播放 */
export function animateHeronScene(svg: SVGSVGElement, detail: Detail, startAt = 0) {
  const parts = new Map<string, Element>();
  svg.querySelectorAll("[data-part]").forEach((el) => {
    const name = el.getAttribute("data-part")!;
    if (name !== "mark" && name !== "petal") parts.set(name, el);
  });
  const g = detail === "icon" ? null : generate(detail);
  const markEls = svg.querySelectorAll('[data-part="mark"]');
  const petalEls = svg.querySelectorAll('[data-part="petal"]');
  // 渲染时背后的花瓣在前、前景花瓣在后，这里按同样顺序对应
  const petals = g ? [...g.petals.filter((x) => !x.front), ...g.petals.filter((x) => x.front)] : [];

  let elapsed = startAt, previous: number | null = null, frame = 0;
  const tick = (now: number) => {
    if (previous !== null) elapsed += Math.min((now - previous) / 1000, 0.05);
    previous = now;
    for (const [name, value] of Object.entries(pose(elapsed))) parts.get(name)?.setAttribute("transform", value);
    g?.marks.forEach((m, i) => markEls[i]?.setAttribute("transform", markTransform(m, elapsed, detail)));
    petals.forEach((x, i) => petalEls[i]?.setAttribute("transform", petalTransform(x, elapsed, detail)));
    frame = requestAnimationFrame(tick);
  };
  const onVisibility = () => (previous = null);
  document.addEventListener("visibilitychange", onVisibility);
  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame);
    document.removeEventListener("visibilitychange", onVisibility);
    return elapsed;
  };
}
