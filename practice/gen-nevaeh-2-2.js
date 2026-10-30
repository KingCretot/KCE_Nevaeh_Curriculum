/* Nevaeh — Lesson 2.2 Extra Practice: writing a linear inequality from a graph in three forms */
(function (K) {
  var ri = K.ri, rnz = K.rnz, pick = K.pick, n = K.n, P = K.poly, X = K.x, Y = K.y, Q = K.Q, mc = K.mc, m = K.m;
  var S = K.ineqSym, FL = K.flipSym, LE = '≤', GE = '≥';
  var ALT = { '<': '<=', '<=': '<', '>': '>=', '>=': '>' };

  /* a line through two integer points: slope p/q, integer intercept b */
  function line() {
    var q = pick([1, 1, 2, 3, 4]), p = rnz(-4, 4);
    if (Math.abs(p) === q && q > 1) p = p > 0 ? p + 1 : p - 1;
    var mm = K.R(p, q), bb = ri(-3, 3);
    var k = pick([-1, 1]) * q * (q > 2 ? 1 : pick([1, 2]));
    var x1 = k, y1 = mm.mul(x1).add(bb).val();
    if (Math.abs(y1) > 5) { x1 = -x1; y1 = mm.mul(x1).add(bb).val(); }
    if (Math.abs(y1) > 5 || x1 === 0) { x1 = q; y1 = mm.mul(q).add(bb).val(); }
    return { mm: mm, p: mm.n, q: mm.d, bb: bb, x1: x1, y1: y1 };
  }
  function shade(mm, bb, sym) { var up = sym === '>' || sym === '>=', mv = K.R(mm).val(); return up ? { a: mv, b: -1, c: -bb } : { a: -mv, b: 1, c: bb }; }
  function graph(L, sym, withPts) {
    var o = { x: [-6, 6], y: [-6, 6], lines: [{ m: L.mm, b: L.bb, dash: sym.length === 1 }] };
    if (sym) o.shade = [shade(L.mm, L.bb, sym)];
    if (withPts !== false) o.pts = [{ x: 0, y: L.bb }, { x: L.x1, y: L.y1 }];
    return K.plane(o);
  }
  function slopeInt(mm, bb, sym) { return m('<i>y</i> ' + S[sym] + ' ' + P([[mm, X], [bb, '']])); }
  function eqLine(mm, bb) { return m('<i>y</i> = ' + P([[mm, X], [bb, '']])); }
  function side(v, letter) { return v === 0 ? letter : letter + ' ' + (v > 0 ? '− ' + v : '+ ' + (-v)); }
  function coef(mm) { var v = mm.val(); return v === 1 ? '' : v === -1 ? '−' : mm.html(); }
  function pointSlope(mm, x1, y1, sym) { return m(side(y1, '<i>y</i>') + ' ' + S[sym] + ' ' + coef(mm) + '(' + side(x1, '<i>x</i>') + ')'); }
  function noParens(mm, x1, y1, sym) { return m(side(y1, '<i>y</i>') + ' ' + S[sym] + ' ' + P([[mm, X]])); }
  function signSwap(mm, x1, y1, sym) { return m(side(-y1, '<i>y</i>') + ' ' + S[sym] + ' ' + coef(mm) + '(' + side(-x1, '<i>x</i>') + ')'); }
  /* standard form: y sym (p/q)x + b  ->  A x + B y sym C with A > 0 */
  function std(L, sym) {
    var A = -L.p, B = L.q, C = L.bb * L.q, s = sym;
    if (A < 0) { A = -A; B = -B; C = -C; s = FL[sym]; }
    return { A: A, B: B, C: C, s: s };
  }
  function stdTxt(o) { return m(P([[o.A, X], [o.B, Y]]) + ' ' + S[o.s] + ' ' + n(o.C)); }
  function dir(sym) { return (sym === '>' || sym === '>=') ? 'above' : 'below'; }
  function lineWord(sym) { return sym.length === 1 ? '<b>dashed</b>, so use &lt; or &gt;' : '<b>solid</b>, so use ' + LE + ' or ' + GE; }
  function readWhy(L, sym) {
    return ['Find the <b>' + Y + '-intercept</b>: the line crosses the ' + Y + '-axis at ' + K.pt(0, L.bb) + ', so ' + m('<i>b</i> = ' + n(L.bb)) + '.',
      'Find the <b>slope</b> between the two dots ' + K.pt(0, L.bb) + ' and ' + K.pt(L.x1, L.y1) + ': rise ' + n(L.y1 - L.bb) + ' over run ' + n(L.x1) + ' = ' + L.mm.html() + '.',
      'The line is ' + lineWord(sym) + '. The shading is <b>' + dir(sym) + '</b> the line, so ' + Y + ' is ' + (dir(sym) === 'above' ? 'greater' : 'less') + '.'];
  }

  var lv1 = [
    function () { var L = line();
      return Q({ q: 'What is the equation of the line? Use the two marked points.', graph: graph(L, '', true), mc: mc(eqLine(L.mm, L.bb), [eqLine(L.mm.neg(), L.bb), eqLine(L.mm, -L.bb === L.bb ? L.bb + 2 : -L.bb), eqLine(K.R(L.q, L.p), L.bb)], function () { return eqLine(L.mm.add(K.R(rnz(-2, 2))), L.bb); }),
        why: ['The line crosses the ' + Y + '-axis at ' + K.pt(0, L.bb) + ', so ' + m('<i>b</i> = ' + n(L.bb)) + '.', 'From ' + K.pt(0, L.bb) + ' to ' + K.pt(L.x1, L.y1) + ': rise ' + n(L.y1 - L.bb) + ', run ' + n(L.x1) + ', slope ' + L.mm.html() + '.', 'So ' + eqLine(L.mm, L.bb) + '. Watch the sign: a line that falls from left to right has a negative slope.'] }); },
    function () { var L = line(), sym = pick(['<', '>', '<=', '>=']);
      var right = (sym.length === 2 ? 'Solid line' : 'Dashed line') + ', shade ' + dir(sym);
      var all = ['Solid line, shade above', 'Solid line, shade below', 'Dashed line, shade above', 'Dashed line, shade below'];
      return Q({ q: 'How do you graph ' + slopeInt(L.mm, L.bb, sym) + '?', mc: mc(right, all.filter(function (z) { return z !== right; })),
        why: [S[sym] + (sym.length === 2 ? ' includes "or equal to," so the line is <b>solid</b>.' : ' has no "equal to," so the line is <b>dashed</b>.'), 'With ' + Y + ' alone on the left, ' + ((sym === '>' || sym === '>=') ? '&gt; or ' + GE + ' means shade <b>above</b>.' : '&lt; or ' + LE + ' means shade <b>below</b>.')] }); },
    function () { var L = line(); if (L.bb === 0) L.bb = 2; var sym = pick(['<', '>', '<=', '>=']);
      var t = sym === '<' ? 0 < L.bb : sym === '>' ? 0 > L.bb : sym === '<=' ? 0 <= L.bb : 0 >= L.bb;
      var right = t ? 'True, so (0, 0) is in the shaded region' : 'False, so (0, 0) is NOT in the shaded region';
      return Q({ q: 'Test the point (0, 0) in ' + slopeInt(L.mm, L.bb, sym) + '. What happens?', mc: mc(right, [t ? 'False, so (0, 0) is NOT in the shaded region' : 'True, so (0, 0) is in the shaded region', 'You can never use (0, 0) as a test point', 'It is true only if the line is solid']),
        why: ['Put ' + m('<i>x</i> = 0') + ' and ' + m('<i>y</i> = 0') + ' in: ' + m('0 ' + S[sym] + ' ' + L.mm.html() + '(0) ' + (L.bb < 0 ? '− ' + (-L.bb) : '+ ' + L.bb)) + ', which is ' + m('0 ' + S[sym] + ' ' + n(L.bb)) + '.', 'That is <b>' + (t ? 'true' : 'false') + '</b>, so the side with (0, 0) is ' + (t ? '' : '<b>not</b> ') + 'shaded.'] }); }
  ];
  var lv2 = [
    function () { var L = line(), sym = pick(['<', '>', '<=', '>=']);
      return Q({ q: 'Write the inequality in <b>slope-intercept form</b>.', graph: graph(L, sym), mc: mc(slopeInt(L.mm, L.bb, sym), [slopeInt(L.mm, L.bb, FL[sym]), slopeInt(L.mm, L.bb, ALT[sym]), slopeInt(L.mm.neg(), L.bb, sym)]),
        why: readWhy(L, sym).concat(['Answer: ' + slopeInt(L.mm, L.bb, sym) + '.']) }); },
    function () { var L = line(), sym = pick(['<', '>', '<=', '>=']);
      var right = pointSlope(L.mm, L.x1, L.y1, sym);
      return Q({ q: 'Write the inequality in <b>point-slope form</b> using the marked point ' + K.pt(L.x1, L.y1) + '.', graph: graph(L, sym), mc: mc(right, [noParens(L.mm, L.x1, L.y1, sym), signSwap(L.mm, L.x1, L.y1, sym), pointSlope(L.mm, L.x1, L.y1, FL[sym])]),
        why: ['Point-slope form: ' + m('<i>y</i> − <i>y</i>₁ ' + S[sym] + ' <i>m</i>(<i>x</i> − <i>x</i>₁)') + '. The slope multiplies the <b>whole</b> ' + m('(<i>x</i> − <i>x</i>₁)') + '.', 'Slope ' + L.mm.html() + ', point ' + K.pt(L.x1, L.y1) + '. Subtracting a negative number turns into adding.', 'Answer: ' + right + '.'] }); },
    function () { var L = line(), sym = pick(['<', '>', '<=', '>=']), o = std(L, sym);
      return Q({ q: 'Rewrite ' + slopeInt(L.mm, L.bb, sym) + ' in <b>standard form</b> ' + m('<i>Ax</i> + <i>By</i> ' + S[o.s] + ' <i>C</i>') + ' with ' + m('<i>A</i>') + ' positive.', mc: mc(stdTxt(o), [stdTxt({ A: o.A, B: o.B, C: o.C, s: FL[o.s] }), stdTxt({ A: o.A, B: -o.B, C: o.C, s: o.s }), stdTxt({ A: o.A, B: o.B, C: -o.C || 3, s: o.s })]),
        why: [(L.q > 1 ? 'Multiply every term by ' + L.q + ' to clear the fraction: ' + m(L.q + '<i>y</i> ' + S[sym] + ' ' + P([[L.p, X], [L.bb * L.q, '']])) + '. ' : '') + 'Move the ' + X + '-term to the left: ' + m(P([[-L.p, X], [L.q, Y]]) + ' ' + S[sym] + ' ' + n(L.bb * L.q)) + '.',
          (-L.p < 0 ? 'To make ' + m('<i>A</i>') + ' positive, multiply both sides by −1, and <b>flip the inequality sign</b>.' : m('<i>A</i>') + ' is already positive, so the sign stays the same.'), 'Answer: ' + stdTxt(o) + '.'] }); }
  ];
  var lv3 = [
    function () { var L = line(), sym = pick(['<', '>', '<=', '>=']), o = std(L, sym);
      return Q({ q: 'Write the inequality in <b>standard form</b> with ' + m('<i>A</i>') + ' positive.', graph: graph(L, sym), mc: mc(stdTxt(o), [stdTxt({ A: o.A, B: o.B, C: o.C, s: FL[o.s] }), stdTxt({ A: o.A, B: o.B, C: o.C, s: ALT[o.s] }), stdTxt({ A: o.A, B: -o.B, C: o.C, s: o.s })]),
        why: readWhy(L, sym).concat(['So ' + slopeInt(L.mm, L.bb, sym) + '. Clear any fraction, move the ' + X + '-term left, and flip the sign if you multiply by a negative: ' + stdTxt(o) + '.']) }); },
    function () { var L = line(), sym = pick(['<', '>', '<=', '>=']), o = std(L, sym);
      var forms = [slopeInt(L.mm, L.bb, sym), pointSlope(L.mm, L.x1, L.y1, sym), stdTxt(o)];
      var bad = pick([pointSlope(L.mm, L.x1, L.y1, FL[sym]), noParens(L.mm, L.x1, L.y1, sym), stdTxt({ A: o.A, B: o.B, C: o.C, s: FL[o.s] })]);
      return Q({ q: 'Three of these describe the same shaded graph. Which one does <b>NOT</b>?', graph: graph(L, sym), mc: mc(bad, forms),
        why: ['Slope-intercept: ' + forms[0] + '. Point-slope with ' + K.pt(L.x1, L.y1) + ': ' + forms[1] + '. Standard: ' + forms[2] + '.', 'The odd one out either flips the sign without a reason or forgets the parentheses in ' + m('(<i>x</i> − <i>x</i>₁)') + '.'] }); },
    function () { var L = line(), sym = pick(['<', '>', '<=', '>=']), o = std(L, sym);
      var good = null, badp = [], g = 0;
      while ((!good || badp.length < 3) && g++ < 600) { var x = ri(-5, 5), y = ri(-5, 5), r = L.mm.mul(x).add(L.bb).val(); if (Math.abs(y - r) < 0.75) continue;
        var ok = sym === '<' ? y < r : sym === '>' ? y > r : sym === '<=' ? y <= r : y >= r;
        if (ok) { if (!good) good = [x, y]; } else if (!badp.some(function (q) { return q[0] === x && q[1] === y; })) badp.push([x, y]); }
      return Q({ q: 'Which point is a solution of ' + stdTxt(o) + '? (Check it with the inequality, just like the "Check with Test Point" column.)', mc: mc(K.pt(good[0], good[1]), badp.slice(0, 3).map(function (p) { return K.pt(p[0], p[1]); })),
        why: ['Substitute ' + K.pt(good[0], good[1]) + ': ' + m(o.A + '(' + n(good[0]) + ') ' + (o.B < 0 ? '− ' + (-o.B) : '+ ' + o.B) + '(' + n(good[1]) + ') = ' + n(o.A * good[0] + o.B * good[1])) + ', and ' + m(n(o.A * good[0] + o.B * good[1]) + ' ' + S[o.s] + ' ' + n(o.C)) + ' is true ✔.', 'Each other point makes the inequality false.'] }); }
  ];
  K.lesson('2.2 Extra', { title: 'Writing Inequalities in Three Forms', std: 'Nevaeh · slope-intercept, point-slope, standard form', levels: [lv1, lv2, lv3] });
})(window.KCEP);
