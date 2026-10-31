/* محاسبات حقوقی — بدون وابستگی؛ همه‌چیز روی مرورگر کاربر اجرا می‌شود.
   منطق ارث بر پایه‌ی مواد ۸۶۱ تا ۹۱۳ و ۹۴۶ قانون مدنی و خسارت تأخیر بر پایه‌ی ماده ۵۲۲ آیین دادرسی مدنی. */
(function (root) {
    'use strict';

    // ---------- کسرهای دقیق ----------
    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
    function frac(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n: n / g, d: d / g }; }
    function add(a, b) { return frac(a.n * b.d + b.n * a.d, a.d * b.d); }
    function sub(a, b) { return frac(a.n * b.d - b.n * a.d, a.d * b.d); }
    function mul(a, b) { return frac(a.n * b.n, a.d * b.d); }
    function div(a, b) { return frac(a.n * b.d, a.d * b.n); }
    var ZERO = frac(0, 1), ONE = frac(1, 1);
    function val(f) { return f.n / f.d; }

    // ---------- ارث: طبقه‌ی اول + زوج/زوجه ----------
    function inherit(inp) {
        var sons = Math.max(0, inp.sons | 0), daughters = Math.max(0, inp.daughters | 0);
        var children = sons + daughters;
        var father = !!inp.father, mother = !!inp.mother;
        var spouse = inp.spouse || 'none';
        var wives = spouse === 'wife' ? Math.min(4, Math.max(1, inp.wives | 0 || 1)) : 0;
        var notes = [];
        if (!father && !mother && children === 0) {
            return { error: 'برای این ابزار دست‌کم یکی از وراث طبقه‌ی اول (پدر، مادر یا فرزند) باید باشد. اگر فقط زوج یا زوجه هست، وراث طبقه‌ی دوم و سوم هم وارث‌اند و این ابزار آن‌ها را پوشش نمی‌دهد (ماده ۸۶۳).' };
        }
        var hasChild = children > 0;
        var heirs = [];
        var spouseTotal = ZERO;
        if (spouse === 'husband') spouseTotal = hasChild ? frac(1, 4) : frac(1, 2);
        if (spouse === 'wife') spouseTotal = hasChild ? frac(1, 8) : frac(1, 4);

        var motherShare = ZERO, fatherShare = ZERO;
        var motherBlocked = !!inp.motherBlocked && father;
        if (inp.motherBlocked && !father) {
            notes.push('حجب مادر (ماده ۸۹۲ ب) فقط وقتی اثر دارد که پدر زنده باشد؛ نادیده گرفته شد.');
        }
        if (mother) motherShare = (hasChild || motherBlocked) ? frac(1, 6) : frac(1, 3);
        if (father && hasChild) fatherShare = frac(1, 6);
        var rest;

        if (hasChild) {
            var parentsFard = add(motherShare, fatherShare);
            var childrenRest = sub(sub(ONE, spouseTotal), parentsFard);
            if (sons > 0) {
                // وجود پسر: ابوین و زوج فرض می‌برند و بقیه به اولاد با نسبت دو به یک (ماده ۹۰۷)
                var weight = 2 * sons + daughters;
                var unit = div(childrenRest, frac(weight, 1));
                heirs.push({ role: 'هر پسر' + (sons > 1 ? ' (' + sons + ' نفر)' : ''), each: mul(unit, frac(2, 1)), count: sons });
                if (daughters) heirs.push({ role: 'هر دختر' + (daughters > 1 ? ' (' + daughters + ' نفر)' : ''), each: unit, count: daughters });
            } else {
                // فقط دختر: فرض یک دختر نصف و چند دختر دو ثلث (مواد ۹۰۸ و ۹۰۹)
                var daughtersFard = daughters === 1 ? frac(1, 2) : frac(2, 3);
                var fardSum = add(add(spouseTotal, parentsFard), daughtersFard);
                var dEach;
                if (fardSum.n > fardSum.d) {
                    // نقص بر دختران وارد می‌شود
                    dEach = div(childrenRest, frac(daughters, 1));
                    notes.push('چون مجموع فرض‌ها از کل ترکه بیشتر می‌شود، نقص بر دختران وارد شده است.');
                    if (father) fatherShare = frac(1, 6);
                } else if (fardSum.n < fardSum.d) {
                    // رد: مابقی به نسبت فرض‌ها بین دختران و ابوین، نه زوج/زوجه و نه مادر دارای حاجب (مواد ۹۰۸ و ۹۰۹)
                    var extra = sub(ONE, fardSum);
                    var wD = daughtersFard, wF = father ? frac(1, 6) : ZERO, wM = (mother && !motherBlocked) ? frac(1, 6) : ZERO;
                    var wSum = add(add(wD, wF), wM);
                    dEach = div(add(daughtersFard, mul(extra, div(wD, wSum))), frac(daughters, 1));
                    if (father) fatherShare = add(frac(1, 6), mul(extra, div(wF, wSum)));
                    if (mother) motherShare = add(frac(1, 6), mul(extra, div(wM, wSum)));
                    notes.push('مابقی طبق مواد ۹۰۸ و ۹۰۹ به نسبت فرض‌ها بین دختران و ابوین رد شده است (به زوج یا زوجه و مادر دارای حاجب رد نمی‌شود).');
                } else {
                    dEach = div(daughtersFard, frac(daughters, 1));
                    if (father) fatherShare = frac(1, 6);
                }
                heirs.push({ role: 'هر دختر' + (daughters > 1 ? ' (' + daughters + ' نفر)' : ''), each: dEach, count: daughters });
            }
        } else {
            rest = sub(ONE, add(add(spouseTotal, motherShare), fatherShare));
            if (father) {
                fatherShare = rest;            // پدر بقیه را می‌برد
            } else if (mother) {
                // ماده ۹۰۵: زائد بر فریضه به مادر رد می‌شود، نه به زوج/زوجه
                motherShare = add(motherShare, rest);
                notes.push('باقی‌مانده طبق ماده ۹۰۵ به مادر رد شده است (به زوج یا زوجه رد نمی‌شود).');
            }
        }
        if (father) heirs.unshift({ role: 'پدر', each: fatherShare, count: 1 });
        if (mother) heirs.unshift({ role: 'مادر' + (motherBlocked ? ' (دارای حاجب)' : ''), each: motherShare, count: 1 });
        if (spouse === 'husband') heirs.unshift({ role: 'شوهر', each: spouseTotal, count: 1 });
        if (spouse === 'wife') heirs.unshift({ role: wives > 1 ? 'هر زوجه (' + wives + ' نفر)' : 'زوجه', each: div(spouseTotal, frac(wives, 1)), count: wives });

        var total = ZERO;
        heirs.forEach(function (h) { total = add(total, mul(h.each, frac(h.count, 1))); });
        if (spouse === 'wife') notes.push('طبق ماده ۹۴۶، زوجه از عین اموال غیرمنقول (عرصه) ارث نمی‌برد و سهمش از قیمت غیرمنقول پرداخت می‌شود.');
        if (hasChild) notes.push('با وجود فرزند، نوه ارث نمی‌برد. اگر فرزندی در زمان فوت زنده نبوده و فرزند او زنده است، این ابزار آن را پوشش نمی‌دهد.');
        notes.push('پیش از تقسیم، کفن و دیون و وصایا (تا یک‌سوم، ماده ۸۶۹) از ترکه کسر می‌شود. مبلغ را «خالص ترکه» وارد کنید.');
        return { heirs: heirs, total: total, ok: total.n === total.d, notes: notes };
    }

    // ---------- خسارت تأخیر تأدیه: ماده ۵۲۲ آ.د.م ----------
    function lateDamages(principal, indexDue, indexPay) {
        if (!(principal > 0) || !(indexDue > 0) || !(indexPay > 0)) return { error: 'هر سه مقدار باید عددی بزرگ‌تر از صفر باشد.' };
        var ratio = indexPay / indexDue;
        var damages = principal * ratio - principal;
        var out = { ratio: ratio, damages: Math.max(0, Math.round(damages)), total: Math.round(principal + Math.max(0, damages)), notes: [] };
        if (ratio <= 1) out.notes.push('شاخص افزایش نیافته؛ خسارتی تعلق نمی‌گیرد.');
        if (ratio > 1 && ratio < 1.1) out.notes.push('ماده ۵۲۲ تغییر «فاحش» شاخص را شرط می‌داند؛ دادگاه در تغییر کم ممکن است خسارت ندهد.');
        out.notes.push('شاخص‌ها را از بانک مرکزی (شاخص قیمت مصرف‌کننده، ماه سررسید و ماه پرداخت) بگیرید. خسارت فقط پس از مطالبه‌ی طلبکار و امتناع مدیون با وجود تمکن او قابل مطالبه است.');
        return out;
    }

    var api = { frac: frac, inherit: inherit, lateDamages: lateDamages, val: val };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.ILHCalc = api;

    // ---------- رابط کاربری ----------
    if (typeof document === 'undefined') return;
    var FA = '۰۱۲۳۴۵۶۷۸۹';
    function fa(s) { return String(s).replace(/\d/g, function (d) { return FA[d]; }); }
    function en(s) { return String(s).replace(/[۰-۹]/g, function (d) { return FA.indexOf(d); }).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }).replace(/[٬,،\s]/g, ''); }
    function num(id) { var el = document.getElementById(id); var v = parseFloat(en(el ? el.value : '')); return isNaN(v) ? 0 : v; }
    function money(n) { return fa(Math.round(n).toLocaleString('en-US').replace(/,/g, '٬')); }
    function fracText(f) { return f.n === 0 ? '۰' : (f.d === 1 ? fa(f.n) : fa(f.n) + '/' + fa(f.d)); }

    function init() {
        var host = document.getElementById('calc-inherit-result');
        if (!host) return;
        var spouseSel = document.getElementById('inh-spouse');
        var wivesWrap = document.getElementById('inh-wives-wrap');
        spouseSel.addEventListener('change', function () { wivesWrap.style.display = spouseSel.value === 'wife' ? '' : 'none'; });
        document.getElementById('inh-run').addEventListener('click', function () {
            var estate = num('inh-estate');
            var r = inherit({
                spouse: spouseSel.value, wives: num('inh-wives') || 1,
                father: document.getElementById('inh-father').checked, mother: document.getElementById('inh-mother').checked,
                motherBlocked: document.getElementById('inh-blocked').checked,
                sons: num('inh-sons'), daughters: num('inh-daughters')
            });
            if (r.error) { host.innerHTML = '<p class="calc-error"></p>'; host.firstChild.textContent = r.error; return; }
            var html = '<table class="calc-table"><thead><tr><th>وارث</th><th>سهم</th><th>درصد</th>' + (estate ? '<th>مبلغ (ریال)</th>' : '') + '</tr></thead><tbody>';
            r.heirs.forEach(function (h) {
                html += '<tr><td>' + h.role + '</td><td>' + fracText(h.each) + '</td><td>' + fa((val(h.each) * 100).toFixed(2)) + '٪</td>' + (estate ? '<td>' + money(estate * val(h.each)) + '</td>' : '') + '</tr>';
            });
            html += '</tbody></table><ul class="calc-notes">' + r.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>';
            host.innerHTML = html;
        });
        document.getElementById('late-run').addEventListener('click', function () {
            var r = lateDamages(num('late-principal'), num('late-due'), num('late-pay'));
            var out = document.getElementById('calc-late-result');
            if (r.error) { out.innerHTML = '<p class="calc-error"></p>'; out.firstChild.textContent = r.error; return; }
            out.innerHTML = '<table class="calc-table"><tbody>' +
                '<tr><td>نسبت تغییر شاخص</td><td>' + fa(r.ratio.toFixed(4)).replace('.', '٫') + '</td></tr>' +
                '<tr><td>خسارت تأخیر تأدیه (ریال)</td><td>' + money(r.damages) + '</td></tr>' +
                '<tr><td>جمع اصل و خسارت (ریال)</td><td>' + money(r.total) + '</td></tr></tbody></table>' +
                '<ul class="calc-notes">' + r.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>';
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(typeof window !== 'undefined' ? window : this);
