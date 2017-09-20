import * as d3 from 'd3';

export default function(year0, year1, month1, callback){
  month1 = Math.min(month1, 11);
  month1 = Math.max(month1, 0);
  month1++;
  
  const adaptCpi = function(a){
    a.forEach(function(d) {
      d["Delta"] = +d["12-Month % Change"];
      d["Month"] = +d["Period"].substring(1);
      d["Value"] = +d["Value"];
      // console.log(d);
    });
    console.log(a[0]);
    return a;
  }

  const adaptSur = function(a){
    a.forEach(function(d) {
      d["Month"] = +d["Period"].substring(1);
      d["Value"] = +d["Value"];
      // console.log(d);
    });
    console.log(a[0]);
    return a;
  }

  const adaptFfr = function(a){
    a.forEach(function(d) {
      let ym = d["Year_Month"].split('-');
      d["Year"] = +ym[0];
      d["Month"] = +ym[1];
      d["Value"] = +d["Value"];
      // console.log(d);
    });
    console.log(a[0]);
    return a;
  }

  const adaptGdp = function(a){
    a.forEach(function(d) {
      let ymd = d["DATE"].split('-');
      d["Year"] = +ymd[0];
      d["Month"] = +ymd[1];
      d["Value"] = +d["Value"];
      // console.log(d);
    });
    console.log(a[0]);

    let tr = [];
    let interpolator;
    for (var i = 0; i < a.length-1; i++){
      // console.log(a);
      interpolator = d3.interpolate(a[i].Value, a[i+1].Value);
      for (var j = 0; j < 3; j++) {
        tr.push({
          Year: a[i].Year,
          Month: a[i].Month+j,
          Value: Math.round(interpolator(j/3)*10)/10,
        })
      }
      // tr.push(interpolator(0));
      // tr.push(interpolator(1.0/3.0));
      // tr.push(interpolator(2.0/3));
    }
    // tr.forEach(function(d, i){console.log(d);});
    return tr;
  }

  const adapt = function(error, cpi, sur, ffr, gdp){
    console.log("Data loaded! Adapting...");
    cpi = adaptCpi(cpi);
    sur = adaptSur(sur);
    ffr = adaptFfr(ffr);
    gdp = adaptGdp(gdp);

    console.log("Lengths: cpi: %s, sur: %s, ffr: %s, gdp: %s", cpi.length, sur.length, ffr.length, gdp.length);

    let l = Math.min(cpi.length, sur.length, ffr.length, gdp.length);

    let tr = [];

    for (var i = year0; i < year1; i++) {
      let jLimit = i+1==year1 ? month1+1 : 13;
      for (var j = 1; j < jLimit; j++) {
        let matcher = d => {return d.Year == i && d.Month == j};
        tr.push({
          year: i,
          month: j-1,
          inf: cpi.find(matcher).Delta,
          sur: sur.find(matcher).Value,
          ffr: ffr.find(matcher).Value,
          gdp: gdp.find(matcher).Value,
        });
      }
    }

    console.log("Data adapted! Triggering callback...");
    callback(tr);
  }

  d3.queue()
    .defer(d3.csv, "/app/data/cpi-2000-2017-1mo.csv")
    .defer(d3.csv, "/app/data/sur-2000-2017-1mo.csv")
    .defer(d3.csv, "/app/data/ffr-2000-2017-1mo.csv")
    .defer(d3.csv, "/app/data/gdp-2000-2017-3mo.csv")
    .await(adapt);

  console.log("Loading data...");
}