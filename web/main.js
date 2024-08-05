$(() => { FissionOpt().then((FissionOpt) => {
  const run = $('#run'), pause = $('#pause'), stop = $('#stop'), reset = $('#reset');
  let opt = null, timeout = null, initialDisplay = false;
  
  function updateDisables() {
    $('#settings input').prop('disabled', opt !== null);
    $('#settings a')[opt === null ? 'removeClass' : 'addClass']('disabledLink');
    run[timeout === null ? 'removeClass' : 'addClass']('disabledLink');
    pause[timeout !== null ? 'removeClass' : 'addClass']('disabledLink');
    stop[opt !== null ? 'removeClass' : 'addClass']('disabledLink');
    reset[timeout === null ? 'removeClass' : 'addClass']('disabledLink');
  };

  const fuels = {
    UraniumIngot: { name: 'Uranium Ingot', oxide: false },
    TBU:     { name: 'TBU',      oxide: true  },
    LEU233:  { name: 'LEU-233',  oxide: true  },
    HEU233:  { name: 'HEU-233',  oxide: true  },
    LEU235:  { name: 'LEU-235',  oxide: true  },
    HEU235:  { name: 'HEU-235',  oxide: true  },
    LEN236:  { name: 'LEN-236',  oxide: true  },
    HEN236:  { name: 'HEN-236',  oxide: true  },
    MOX239:  { name: 'MOX-239',  oxide: false },
    MOX241:  { name: 'MOX-241',  oxide: false },
    LEP239:  { name: 'LEP-239',  oxide: true  },
    HEP239:  { name: 'HEP-239',  oxide: true  },
    LEP241:  { name: 'LEP-241',  oxide: true  },
    HEP241:  { name: 'HEP-241',  oxide: true  },
    LEA242:  { name: 'LEA-242',  oxide: true  },
    HEA242:  { name: 'HEA-242',  oxide: true  },
    LECm243: { name: 'LECm-243', oxide: true  },
    HECm243: { name: 'HECm-243', oxide: true  },
    LECm245: { name: 'LECm-245', oxide: true  },
    HECm245: { name: 'HECm-245', oxide: true  },
    LECm247: { name: 'LECm-247', oxide: true  },
    HECm247: { name: 'HECm-247', oxide: true  },
    LEB248:  { name: 'LEB-248',  oxide: true  },
    HEB248:  { name: 'HEB-248',  oxide: true  },
    LECf249: { name: 'LECf-249', oxide: true  },
    HECf249: { name: 'HECf-249', oxide: true  },
    LECf251: { name: 'LECf-251', oxide: true  },
    HECf251: { name: 'HECf-251', oxide: true  },
  };
  const fuelPresets = {
    Default: {
      TBU: [60, 18],
      TBUO: [84, 22.5],
      LEU233: [144, 60],
      LEU233O: [201.6, 75],
      HEU233: [576, 360],
      HEU233O: [806.4, 450],
      LEU235: [120, 50],
      LEU235O: [168, 62.5],
      HEU235: [480, 300],
      HEU235O: [672, 375],
      LEN236: [90, 36],
      LEN236O: [126, 45],
      HEN236: [360, 216],
      HEN236O: [504, 270],
      MOX239: [155.4, 57.5],
      MOX241: [243.6, 97.5],
      LEP239: [105, 40],
      LEP239O: [147, 50],
      HEP239: [420, 240],
      HEP239O: [588, 300],
      LEP241: [165, 70],
      LEP241O: [231, 87.5],
      HEP241: [660, 420],
      HEP241O: [924, 525],
      LEA242: [192, 94],
      LEA242O: [268.8, 117.5],
      HEA242: [768, 564],
      HEA242O: [1075.2, 705],
      LECm243: [210, 112],
      LECm243O: [294, 140],
      HECm243: [840, 672],
      HECm243O: [1176, 840],
      LECm245: [162, 68],
      LECm245O: [226.8, 85],
      HECm245: [648, 408],
      HECm245O: [907.2, 510],
      LECm247: [138, 54],
      LECm247O: [193.2, 67.5],
      HECm247: [552, 324],
      HECm247O: [772.8, 405],
      LEB248: [135, 52],
      LEB248O: [189, 65],
      HEB248: [540, 312],
      HEB248O: [756, 390],
      LECf249: [216, 116],
      LECf249O: [302.4, 145],
      HECf249: [864, 696],
      HECf249O: [1209.6, 870],
      LECf251: [225, 120],
      LECf251O: [315, 150],
      HECf251: [900, 720],
      HECf251O: [1260, 900],
    },
    E2E: {
      UraniumIngot: [600, 48],
      TBU: [360, 21.6],
      TBUO: [504, 27],
      LEU233: [864, 72],
      LEU233O: [1209.6, 90],
      HEU233: [3456, 432],
      HEU233O: [4838.4, 540],
      LEU235: [720, 60],
      LEU235O: [1008, 75],
      HEU235: [2880, 360],
      HEU235O: [4032, 450],
      LEN236: [540, 43.2],
      LEN236O: [756, 54],
      HEN236: [2160, 259.2],
      HEN236O: [3024, 324],
      MOX239: [932.4, 69],
      MOX241: [1461.6, 117],
      LEP239: [630, 48],
      LEP239O: [882, 60],
      HEP239: [2520, 288],
      HEP239O: [3528, 360],
      LEP241: [990, 84],
      LEP241O: [1386, 105],
      HEP241: [3960, 504],
      HEP241O: [5544, 630],
      LEA242: [1152, 112.8],
      LEA242O: [1612.8, 141],
      HEA242: [4608, 676.8],
      HEA242O: [6451.2, 846],
      LECm243: [1260, 134.4],
      LECm243O: [1764, 168],
      HECm243: [5040, 806.4],
      HECm243O: [7056, 1008],
      LECm245: [972, 81.6],
      LECm245O: [1360.8, 102],
      HECm245: [3888, 489.6],
      HECm245O: [5443.2, 612],
      LECm247: [828, 64.8],
      LECm247O: [1159.2, 81],
      HECm247: [3312, 388.8],
      HECm247O: [4636.8, 486],
      LEB248: [810, 62.4],
      LEB248O: [1134, 78],
      HEB248: [3240, 374.4],
      HEB248O: [4536, 468],
      LECf249: [1296, 139.2],
      LECf249O: [1814.4, 174],
      HECf249: [5184, 835.2],
      HECf249O: [7257.6, 1044],
      LECf251: [1350, 144],
      LECf251O: [1890, 180],
      HECf251: [5400, 864],
      HECf251O: [7560, 1080],
    },
    PO3: {
      TBU: [18000, 72],
      TBUO: [25200, 90],
      LEU233: [43200, 240],
      LEU233O: [60318, 300],
      HEU233: [172800, 1440],
      HEU233O: [241812, 1800],
      LEU235: [36000, 200],
      LEU235O: [50400, 250],
      HEU235: [144000, 1200],
      HEU235O: [201600, 1500],
      LEN236: [27000, 144],
      LEN236O: [37800, 180],
      HEN236: [108000, 864],
      HEN236O: [151200, 1080],
      MOX239: [46512, 230],
      MOX241: [72918, 390],
      LEP239: [31500, 160],
      LEP239O: [44100, 200],
      HEP239: [126000, 960],
      HEP239O: [176400, 1200],
      LEP241: [49500, 280],
      LEP241O: [69300, 350],
      HEP241: [198000, 1680],
      HEP241O: [277200, 2100],
      LEA242: [57600, 376],
      LEA242O: [80424, 470],
      HEA242: [230400, 2256],
      HEA242O: [322506, 2820],
      LECm243: [63000, 448],
      LECm243O: [88200, 560],
      HECm243: [252000, 2688],
      HECm243O: [352800, 3360],
      LECm245: [48600, 272],
      LECm245O: [67824, 340],
      HECm245: [194400, 1632],
      HECm245O: [272106, 2040],
      LECm247: [41400, 216],
      LECm247O: [57906, 270],
      HECm247: [165600, 1296],
      HECm247O: [231624, 1620],
      LEB248: [40500, 208],
      LEB248O: [56700, 260],
      HEB248: [162000, 1248],
      HEB248O: [226800, 1560],
      LECf249: [64800, 464],
      LECf249O: [90612, 580],
      HECf249: [259200, 2784],
      HECf249O: [362718, 3480],
      LECf251: [67500, 480],
      LECf251O: [94500, 600],
      HECf251: [270000, 2880],
      HECf251O: [378000, 3600],
    },
  };

  function fuelClick(event) {
    event.preventDefault();
    if (opt !== null) return;
    const t = $(event.target);
    $('#fuelBasePower').val(t.data('power'));
    $('#fuelBaseHeat').val(t.data('heat'));
  }

  function loadFuels(fuelsConfig) {
    const table = $('<table>');
    $('#fuels :first').remove()
    $('#fuels').append(table);
    let lastRow = null;
    for (let [key, [power, heat]] of Object.entries(fuelsConfig)) {
      var oxide = key.slice(-1) === 'O';
      if (oxide) key = key.slice(0, -1);
      const fuel = fuels[key];
      if (!fuel) {
        console.log('Missing fuel: ' + key);
        continue;
      }
      if (!oxide) {
        const tr = lastRow = $('<tr>');
        table.append(tr);
      }
      const td = $('<td>');
      lastRow.append(td);
      const a = $('<a>');
      td.append(a);
      a.attr('href', '#');
      a.text((oxide ? 'Oxide' : fuel.name));
      a.data('power', power);
      a.data('heat', heat);
      a.on('click', fuelClick);
    }
  }

  let lastConfig = null;
  function fuelRadioChanged(event) {
    const value = event.target.value;
    if (value === 'Custom' && !fuelPresets.Custom) {
      $('#uploadConfig').trigger('click');
      return;
    }
    lastConfig = value;
    loadFuels(fuelPresets[value]);
  }
  $('#fuelRadios input[type=radio]').on('change', fuelRadioChanged)
  
  function applyFuelFactor(fuel, factor) {
    if (opt !== null)
      return;
    const f = fuelPresets.Default[fuel];
    $('#fuelBasePower').val(f[0] * factor);
    $('#fuelBaseHeat').val(f[1] * factor);
  };
  $('#br').on('click', () => { applyFuelFactor('LEU235', 8 / 9); });
  $('#ic2').on('click', () => { applyFuelFactor('LEU235', 18 / 19); });
  $('#ic2mox').on('click', () => { applyFuelFactor('MOX239', 9 / 7); });
  
  const rates = [], limits = [];
  $('#rate input').each(function() { rates.push($(this)); });
  $('#activeRate input').each(function() { rates.push($(this)); });
  $('#limit input').each(function() { limits.push($(this)); });
  {
    const tail = limits.splice(-2);
    $('#activeLimit input').each(function() { limits.push($(this)); });
    limits.push(...tail);
  }
  const ratePreset = {
    Def: [
      60, 90, 90, 120, 130, 120, 150, 140, 120, 160, 80, 160, 80, 120, 110,
      150, 3200, 3000, 4800, 4000, 2800, 7000, 6600, 5400, 6400, 2400, 3600, 2600, 3000, 3600
    ],
    E2E: [
      20, 80, 80, 120, 120, 100, 120, 120, 140, 140, 60, 140, 60, 80, 100,
      50, 1000, 1500, 1750, 2000, 2250, 3500, 3300, 2750, 3250, 1700, 2750, 1125, 1250, 2000
    ],
    PO3: [
      40, 160, 160, 240, 240, 200, 240, 240, 280, 800, 120, 280, 120, 160, 200,
      50, 1600, 20000, 4000, 2700, 3200, 3500, 3300, 2700, 3200, 1200, 1800, 1300, 1500, 1800
    ],
  }
  function loadRatePreset(preset) {
    if (opt !== null)
      return;
    $.each(rates, (i, x) => { x.val(preset[i]); });
  };
  loadRatePreset(ratePreset.Def);
  $('#DefRate').on('click', () => { loadRatePreset(ratePreset.Def); });
  $('#E2ERate').on('click', () => { loadRatePreset(ratePreset.E2E); });
  $('#PO3Rate').on('click', () => { loadRatePreset(ratePreset.PO3); });
  $('#CustomRate').on('click', () => {
    if (opt !== null)
      return;
    if (!localStorage['customActiveRate'] || !localStorage['customRate']) {
      $('#uploadConfig').trigger('click');
      return;
    }
    function loadRates(id, key, factor) {
      if (localStorage[key]) {
        const rates = JSON.parse(localStorage[key]);
        $('#'+ id + ' input').each((i, e) => $(e).val(rates[i] / factor));
      }
    }
    loadRates('activeRate', 'customActiveRate', 2);
    loadRates('rate', 'customRate', 1);
  });

  function schedule() {
    timeout = window.setTimeout(step, 0);
  };

  const settings = new FissionOpt.FissionSettings();
  const design = $('#design');
  const save = $('#save');
  const nCoolerTypes = 15, air = nCoolerTypes * 2 + 2;
  const tileNames = ['Wt', 'Rs', 'Qz', 'Au', 'Gs', 'Lp', 'Dm', 'He', 'Ed', 'Cr', 'Fe', 'Em', 'Cu', 'Sn', 'Mg', '[]', '##', '..'];
  const tileTitles = ['Water', 'Redstone', 'Quartz', 'Gold', 'Glowstone', 'Lapis', 'Diamond', 'Liquid Helium',
    'Enderium', 'Cryotheum', 'Iron', 'Emerald', 'Copper', 'Tin', 'Magnesium', 'Reactor Cell', 'Moderator', 'Air'];
  $('#blockType>:not(:first)').each((i, x) => { $(x).attr('title', tileTitles[i]); });
  const tileClasses = tileNames.slice();
  tileClasses[15] = 'cell';
  tileClasses[16] = 'mod';
  tileClasses[17] = 'air';
  const tileSaveNames = tileTitles.slice(0, 17);
  tileSaveNames[7] = 'Helium';
  tileSaveNames[15] = 'FuelCell';
  tileSaveNames[16] = 'Graphite';

  function displayTile(tile) {
    let active = false;
    if (tile >= nCoolerTypes) {
      tile -= nCoolerTypes;
      if (tile < nCoolerTypes)
        active = true;
    }
    const result = $('<span>' + tileNames[tile] + '</span>').addClass(tileClasses[tile]);
    if (active) {
      result.attr('title', 'Active ' + tileTitles[tile]);
      result.addClass('active-cooler')
    } else {
      result.attr('title', tileTitles[tile]);
    }
    return result;
  };

  function saveTile(tile) {
    if (tile >= nCoolerTypes) {
      tile -= nCoolerTypes;
      if (tile < nCoolerTypes) {
        return "Active " + tileSaveNames[tile];
      }
    }
    return tileSaveNames[tile];
  };

  function displaySample(sample) {
    design.empty();
    let block = $('<div></div>');
    function appendInfo(label, value, unit) {
      const row = $('<div></div>').addClass('info');
      row.append('<div>' + label + '</div>');
      row.append(' ' + (Math.round(value * 100) / 100).toLocaleString() + '&nbsp;');
      row.append('<div>' + unit + '</div>');
      block.append(row);
    };
    appendInfo('Max Power', sample.getPower(), 'RF/t');
    appendInfo('Heat', sample.getHeat(), 'H/t');
    appendInfo('Cooling', sample.getCooling(), 'H/t');
    appendInfo('Net Heat', sample.getNetHeat(), 'H/t');
    appendInfo('Duty Cycle', sample.getDutyCycle() * 100, '%');
    appendInfo('Fuel Use Rate', sample.getAvgBreed(), '&times;');
    appendInfo('Efficiency', sample.getEfficiency() * 100, '%');
    appendInfo('Avg Power', sample.getAvgPower(), 'RF/t');
    design.append(block);

    const shapes = [], strides = [], data = sample.getData();
    for (let i = 0; i < 3; ++i) {
      shapes.push(sample.getShape(i));
      strides.push(sample.getStride(i));
    }
    let resourceMap = {};
    const saved = {
      UsedFuel: {name: '', FuelTime: 0.0, BasePower: settings.fuelBasePower, BaseHeat: settings.fuelBaseHeat},
      SaveVersion: {Major: 1, Minor: 2, Build: 24, Revision: 0, MajorRevision: 0, MinorRevision: 0},
      InteriorDimensions: {X: shapes[2], Y: shapes[0], Z: shapes[1]},
      CompressedReactor: {}
    };
    resourceMap[-1] = (shapes[0] * shapes[1] + shapes[1] * shapes[2] + shapes[2] * shapes[0]) * 2;
    for (let x = 0; x < shapes[0]; ++x) {
      block = $('<div></div>');
      block.append('<div>Layer ' + (x + 1) + '</div>');
      for (let y = 0; y < shapes[1]; ++y) {
        const row = $('<div></div>').addClass('row');
        for (let z = 0; z < shapes[2]; ++z) {
          if (z)
            row.append(' ');
          const tile = data[x * strides[0] + y * strides[1] + z * strides[2]];
          if (!resourceMap.hasOwnProperty(tile))
            resourceMap[tile] = 1;
          else
            ++resourceMap[tile];
          const savedTile = saveTile(tile);
          if (savedTile !== undefined) {
            if (!saved.CompressedReactor.hasOwnProperty(savedTile))
              saved.CompressedReactor[savedTile] = [];
            saved.CompressedReactor[savedTile].push({X: z + 1, Y: x + 1, Z: y + 1});
          }
          row.append(displayTile(tile));
        }
        block.append(row);
      }
      design.append(block);

      if (initialDisplay) {
        $('main')[0].scrollIntoView(false);
        initialDisplay = false;
      }
    }

    save.removeClass('disabledLink');
    save.off('click').on('click', () => {
      const elem = document.createElement('a');
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(saved)], {type: 'text/json'}));
      elem.setAttribute('href', url);
      elem.setAttribute('download', 'reactor.json');
      elem.click();
      window.URL.revokeObjectURL(url);
    });

    block = $('<div></div>');
    block.append('<div>Blocks used</div>')
    resourceMap = Object.entries(resourceMap);
    resourceMap.sort((x, y) => y[1] - x[1]);
    for (resource of resourceMap) {
      if (resource[0] == air)
        continue;
      const row = $('<div></div>');
      if (resource[0] < 0)
        row.append('Casing');
      else
        row.append(displayTile(resource[0]).addClass('row'));
      block.append(row.append(' &times; ' + resource[1]));
    }
    design.append(block);
  };

  const progress = $('#progress');
  let lossElement, lossPlot;
  function step() {
    schedule();
    opt.stepInteractive();
    const nStage = opt.getNStage();
    if (nStage == -2)
      progress.text('Episode ' + opt.getNEpisode() + ', training iteration ' + opt.getNIteration());
    else if (nStage == -1)
      progress.text('Episode ' + opt.getNEpisode() + ', inference iteration ' + opt.getNIteration());
    else
      progress.text('Episode ' + opt.getNEpisode() + ', stage ' + nStage + ', iteration ' + opt.getNIteration());
    if (opt.needsRedrawBest())
      displaySample(opt.getBest());
    if (opt.needsReplotLoss()) {
      const data = opt.getLossHistory();
      while (lossPlot.data.labels.length < data.length)
        lossPlot.data.labels.push(lossPlot.data.labels.length);
      lossPlot.data.datasets[0].data = data;
      lossPlot.update({duration: 0});
    }
  };

  run.on('click', () => {
    if (timeout !== null)
      return;
    if (opt === null) {
      function parseSize(x) {
        const result = parseInt(x);
        if (!(result > 0))
          throw Error("Core size must be a positive integer");
        return result;
      };
      function parsePositiveFloat(name, x) {
        const result = parseFloat(x);
        if (!(result > 0))
          throw Error(name + " must be a positive number");
        return result;
      };
      try {
        settings.sizeX = parseSize($('#sizeX').val());
        settings.sizeY = parseSize($('#sizeY').val());
        settings.sizeZ = parseSize($('#sizeZ').val());
        settings.fuelBasePower = parsePositiveFloat('Fuel Base Power', ($('#fuelBasePower')).val());
        settings.fuelBaseHeat = parsePositiveFloat('Fuel Base Heat', ($('#fuelBaseHeat')).val());
        settings.ensureActiveCoolerAccessible = $('#ensureActiveCoolerAccessible').is(':checked');
        settings.ensureHeatNeutral = $('#ensureHeatNeutral').is(':checked');
        settings.goal = parseInt($('input[name=goal]:checked').val());
        settings.symX = $('#symX').is(':checked');
        settings.symY = $('#symY').is(':checked');
        settings.symZ = $('#symZ').is(':checked');
        $.each(rates, (i, x) => { settings.setRate(i, parsePositiveFloat('Cooling Rate', x.val())); });
        $.each(limits, (i, x) => {
          x = parseInt(x.val());
          settings.setLimit(i, x >= 0 ? x : -1);
        });
      } catch (error) {
        alert('Error: ' + error.message);
        return;
      }
      design.empty();
      save.off('click');
      save.addClass('disabledLink');
      if (lossElement !== undefined)
        lossElement.remove();
      const useNet = $('#useNet').is(':checked');
      if (useNet) {
        lossElement = $('<div>').addClass('lossChart').insertAfter(progress);
        let lossCanvas = $('<canvas></canvas>').attr('width', 1024).attr('height', 128).appendTo(lossElement)[0];
        lossPlot = new Chart(lossCanvas.getContext('2d'), {
          type: 'bar',
          options: {
            responsive: false,
            animation: {duration: 0},
            hover: {animationDuration: 0},
            scales: {
              xAxes: [{display: false}],
              yAxes: [{gridLines: {color: '#333333', drawBorder: false}}],
            },
            legend: {display: false}
          },
          data: {labels: [], datasets: [{label: 'Loss', backgroundColor: '#aa0000', data: [], categoryPercentage: 1.0, barPercentage: 1.0}]}
        });
      }
      opt = new FissionOpt.FissionOpt(settings, useNet);
      initialDisplay = true;
    }
    schedule();
    updateDisables();
  });

  pause.on('click', () => {
    if (timeout === null)
      return;
    window.clearTimeout(timeout);
    timeout = null;
    updateDisables();
  });

  stop.on('click', () => {
    if (opt === null)
      return;
    if (timeout !== null) {
      window.clearTimeout(timeout);
      timeout = null;
    }
    opt.delete();
    opt = null;
    updateDisables();
  });

  reset.on('click', () => {
    $('input').each((_, x) => {
      if (x.type === 'text') $(x).val(x.parentNode?.parentNode?.id === 'activeLimit' && '0' || null);
      if (x.type === 'checkbox') x.checked = true
      if (x.type === 'radio') $(x).val(['0'])
    });
    loadRatePreset(ratePreset.Def);
  });

  function uploadConfigChanged(event) {
    const file = event.target.files[0];
    configManager.loadConfigFile(file).then(() => {
      loadFuels(fuelPresets.Custom);
    });
  }
  $('#uploadConfig').on('change', uploadConfigChanged);

  function uploadConfigCanceled(event) {
    $('form')[0]['config'].value = lastConfig;
  }
  $('#uploadConfig').on('cancel', uploadConfigCanceled);

  const configManager = (function() {

    function saveFormState() {
      const lsCache = {};
      $('input').each((_, x) => {
        if (x.type === 'text') {
            if (x.id || x.name) {
            localStorage[x.id || x.name] = $(x).val();
            return;
          }

          const id = x.parentNode?.parentNode?.id;
          if (typeof(id) !== 'undefined') {
            if (!lsCache[id]) {
              localStorage.removeItem(id)
              lsCache[id] = true
            }
            let storage = JSON.parse(localStorage[id] || '[]');
            storage.push($(x).val());
            localStorage[id] = JSON.stringify(storage);
            return;
          }
        }
        if (x.type === 'checkbox') {
          localStorage[x.id || x.name] = x.checked;
        }
        if (x.type === 'radio' && x.checked) {
          localStorage[x.name] = $(x).val();
        }
      });
    }

    function loadFormState() {
      const lsCache = {};
      $('input').each((_, x) => {
        if (x.type === 'text') {
          if (x.id) {
            const val = localStorage[x.id];
            if (typeof(val) !== 'undefined') $(x).val(val);
            return;
          }

          const id = x.parentNode?.parentNode?.id;
          if (typeof(id) !== 'undefined') {
            const storage = lsCache[id] || (lsCache[id] = JSON.parse(localStorage[id]));
            if (typeof(storage) !== 'undefined') {
              $(x).val(storage.splice(0, 1));
            }
            return;
          }
        }
        if (x.type === 'checkbox') {
          x.checked = localStorage[x.id || x.name] === "true";
        }
        if (x.type === 'radio') {
          x.checked = $(x).val() === localStorage[x.name];
          if (x.checked) $(x).trigger('change');
        }
      });
    }

    async function readConfigFile(file) {
      const config = {};
      let lastField;
      let fieldValues;
      for await (let line of lines(file)) {
        processLine(line);
      }
      return config;

      function processLine(line) {
        if (lastField) {
          if (line.trim() === '>') {
            config[lastField] = fieldValues;
            lastField = null;
            fieldValues = null;
            return;
          }
          fieldValues.push(line.trim());
          return;
        }
        const re = /:(.+?)(=| <)(.*)/;
        const matches = re.exec(line);
        if (matches && matches[0]) {
          if (matches[2] === '=' && matches[3]) {
            config[matches[1]] = matches[3];
            return;
          }

          lastField = matches[1];
          fieldValues = [];
          return;
        }
      }

      async function* lines(file) {
        const utf8Decoder = new TextDecoder("utf-8");
        let reader = file.stream().getReader();
        let { value: chunk, done: readerDone } = await reader.read();
        chunk = chunk ? utf8Decoder.decode(chunk, { stream: true }) : "";
      
        let re = /\r\n|\n|\r/gm;
        let startIndex = 0;
      
        for (;;) {
          let result = re.exec(chunk);
          if (!result) {
            if (readerDone) {
              break;
            }
            let remainder = chunk.substr(startIndex);
            ({ value: chunk, done: readerDone } = await reader.read());
            chunk = remainder + (chunk ? utf8Decoder.decode(chunk, { stream: true }) : "");
            startIndex = re.lastIndex = 0;
            continue;
          }
          yield chunk.substring(startIndex, result.index);
          startIndex = re.lastIndex;
        }
        if (startIndex < chunk.length) {
          // last line didn't end in a newline char
          yield chunk.substr(startIndex);
        }
      }
    }

    function loadConfig(config) {
      function loadRates(key, value) {
        if (value) {
          localStorage[key] = JSON.stringify(value);
        }
      }
      loadRates('customActiveRate', config['fission_active_cooling_rate']);
      loadRates('customRate', config['fission_cooling_rate']);
      $('#CustomRate').trigger('click');

      const customFuels = {};
      const ncFuels = {
        thorium: [
          'TBU', 'TBUO',
        ],
        uranium: [
          'LEU233', 'LEU233O', 'HEU233', 'HEU233O',
          'LEU235', 'LEU235O', 'HEU235', 'HEU235O',
        ],
        neptunium: [
          'LEN236', 'LEN236O', 'HEN236', 'HEN236O',
        ],
        mox: [
          'MOX239', 'MOX241'
        ],
        plutonium: [
          'LEP239', 'LEP239O', 'HEP239', 'HEP239O',
          'LEP241', 'LEP241O', 'HEP241', 'HEP241O',
        ],
        americium: [
          'LEA242', 'LEA242O', 'HEA242', 'HEA242O'
        ],
        curium: [
          'LECm243', 'LECm243O', 'HECm243', 'HECm243O',
          'LECm245', 'LECm245O', 'HECm245', 'HECm245O',
          'LECm247', 'LECm247O', 'HECm247', 'HECm247O',
        ],
        berkelium: [
          'LEB248', 'LEB248O', 'HEB248', 'HEB248O',
        ],
        californium: [
          'LECf249', 'LECf249O', 'HECf249', 'HECf249O',
          'LECf251', 'LECf251O', 'HECf251', 'HECf251O',
        ],
      };
      for (let [ncFuelName, ncFuelMats] of Object.entries(ncFuels)) {
        for (let [iAttr, attr] of Object.entries(['_power', '_heat_generation'])) {
          const k = 'fission_' + ncFuelName + attr;
          if (config[k]) {
            for (let [index, value] of Object.entries(config[k])) {
              const mat = ncFuelMats[index];
              if (!customFuels[mat]) customFuels[mat] = [];
              customFuels[mat][iAttr] = value;
            }
          }
        }
      }
      localStorage.customFuels = JSON.stringify(customFuels);
      fuelPresets.Custom = customFuels;
    }

    if (typeof(Storage) !== 'undefined') {
      window.addEventListener('beforeunload', saveFormState);
      loadFormState();
      fuelPresets.Custom = JSON.parse(localStorage.customFuels || 'null');
    }

    return {
      loadConfigFile: (file) => readConfigFile(file).then(loadConfig),
    }
  })();

  if (lastConfig === null) {
    $('#fuelRadios input[type=radio]').first().attr('checked', true).trigger('change');
  }

}); });
