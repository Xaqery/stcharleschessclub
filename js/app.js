/* St. Charles Chess Club - standings page logic.
   Reads window.LADDER_DATA (from data/standings.js). No network calls. */
(function () {
  "use strict";

  var DATA = (window.LADDER_DATA && window.LADDER_DATA.weeks) || [];
  var NUM_COLS = { rank: 1, rating: 1, score: 1, games: 1, accum: 1 };

  var state = {
    weekIndex: 0,
    sortKey: "rank",
    sortDir: 1, // 1 asc, -1 desc
    query: "",
  };

  var els = {
    weekSelect: document.getElementById("weekSelect"),
    search: document.getElementById("search"),
    asOf: document.getElementById("asOf"),
    statRow: document.getElementById("statRow"),
    body: document.getElementById("standingsBody"),
    table: document.getElementById("standingsTable"),
    emptyMsg: document.getElementById("emptyMsg"),
  };

  function currentWeek() { return DATA[state.weekIndex] || null; }

  function toNum(v) {
    if (v === "" || v == null) return -Infinity;
    var f = parseFloat(v);
    return isNaN(f) ? -Infinity : f;
  }

  function compare(a, b) {
    var k = state.sortKey;
    var av, bv;
    if (NUM_COLS[k]) { av = toNum(a[k]); bv = toNum(b[k]); }
    else { av = (a[k] || "").toLowerCase(); bv = (b[k] || "").toLowerCase(); }
    if (av < bv) return -1 * state.sortDir;
    if (av > bv) return 1 * state.sortDir;
    return a.rank - b.rank; // stable tiebreak by rank
  }

  function medalBadge(rank) {
    if (rank === 1) return '<span class="badge">1</span>';
    if (rank === 2) return '<span class="badge">2</span>';
    if (rank === 3) return '<span class="badge">3</span>';
    return String(rank);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function render() {
    var week = currentWeek();
    if (!week) {
      els.asOf.textContent = "No results available yet.";
      return;
    }

    els.asOf.innerHTML = "As of <strong>" + esc(week.label) + "</strong>";

    // Stats
    var stats = [
      { n: week.rankedPlayers, l: "Ranked players" },
    ];
    if (week.playedThisWeek != null) stats.push({ n: week.playedThisWeek, l: "Played that night" });
    var leader = week.standings.find(function (p) { return p.rank === 1; });
    if (leader) stats.push({ n: esc(leader.name), l: "Current leader" });
    els.statRow.innerHTML = stats.map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + "</div></div>";
    }).join("");

    // Rows
    var q = state.query.trim().toLowerCase();
    var rows = week.standings.filter(function (p) {
      return !q || p.name.toLowerCase().indexOf(q) !== -1;
    });
    rows.sort(compare);

    els.emptyMsg.hidden = rows.length !== 0;

    els.body.innerHTML = rows.map(function (p) {
      var medalClass = p.rank <= 3 ? " medal rank-" + p.rank : "";
      return '<tr class="' + medalClass.trim() + '">' +
        '<td class="num rank" data-label="Rank">' + medalBadge(p.rank) + "</td>" +
        '<td class="player" data-label="Player">' + esc(p.name) + "</td>" +
        '<td class="num" data-label="Rating">' + (esc(p.rating) || "&mdash;") + "</td>" +
        '<td class="num score" data-label="Points">' + esc(p.score) + "</td>" +
        '<td class="num" data-label="Games">' + esc(p.games) + "</td>" +
        '<td class="num" data-label="Tiebreak">' + esc(p.accum) + "</td>" +
        "</tr>";
    }).join("");

    // Header sort indicators
    var ths = els.table.querySelectorAll("th.sortable");
    ths.forEach(function (th) {
      th.classList.remove("sorted-asc", "sorted-desc");
      if (th.getAttribute("data-sort") === state.sortKey) {
        th.classList.add(state.sortDir === 1 ? "sorted-asc" : "sorted-desc");
      }
    });
  }

  function init() {
    if (!DATA.length) {
      els.asOf.textContent = "No results available yet. Run build_site.py.";
      return;
    }

    // Week dropdown (newest first)
    els.weekSelect.innerHTML = DATA.map(function (w, i) {
      return '<option value="' + i + '">' + esc(w.label) + "</option>";
    }).join("");

    els.weekSelect.addEventListener("change", function () {
      state.weekIndex = parseInt(this.value, 10) || 0;
      render();
    });

    els.search.addEventListener("input", function () {
      state.query = this.value;
      render();
    });

    els.table.querySelectorAll("th.sortable").forEach(function (th) {
      th.addEventListener("click", function () {
        var key = th.getAttribute("data-sort");
        if (state.sortKey === key) {
          state.sortDir *= -1;
        } else {
          state.sortKey = key;
          // sensible defaults: names asc, numbers like points/rating desc, rank asc
          state.sortDir = (key === "name" || key === "rank") ? 1 : -1;
        }
        render();
      });
    });

    render();
  }

  init();
})();
