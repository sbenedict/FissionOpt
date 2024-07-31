$(() => { FissionOpt().then((FissionOpt) => {
  const run = $('#run'), pause = $('#pause'), stop = $('#stop'), reset = $('#reset');
  let opt = null, timeout = null;
  
  const updateDisables = () => {
    $('#settings input').prop('disabled', opt !== null);
    $('#settings a')[opt === null ? 'removeClass' : 'addClass']('disabledLink');
    run[timeout === null ? 'removeClass' : 'addClass']('disabledLink');
    pause[timeout !== null ? 'removeClass' : 'addClass']('disabledLink');
    stop[opt !== null ? 'removeClass' : 'addClass']('disabledLink');
    reset[timeout === null ? 'removeClass' : 'addClass']('disabledLink');
  };

  const fuelBasePower = $('#fuelBasePower');
  const fuelBaseHeat = $('#fuelBaseHeat');
  const fuelPresets = {
    DefTBU: [60, 18],
    DefTBUO: [84, 22.5],
    DefLEU235: [120, 50],
    DefLEU235O: [168, 62.5],
    DefHEU235: [480, 300],
    DefHEU235O: [672, 375],
    DefLEU233: [144, 60],
    DefLEU233O: [201.6, 75],
    DefHEU233: [576, 360],
    DefHEU233O: [806.4, 450],
    DefLEN236: [90, 36],
    DefLEN236O: [126, 45],
    DefHEN236: [360, 216],
    DefHEN236O: [504, 270],
    DefMOX239: [155.4, 57.5],
    DefMOX241: [243.6, 97.5],
    DefLEP239: [105, 40],
    DefLEP239O: [147, 50],
    DefHEP239: [420, 240],
    DefHEP239O: [588, 300],
    DefLEP241: [165, 70],
    DefLEP241O: [231, 87.5],
    DefHEP241: [660, 420],
    DefHEP241O: [924, 525],
    DefLEA242: [192, 94],
    DefLEA242O: [268.8, 117.5],
    DefHEA242: [768, 564],
    DefHEA242O: [1075.2, 705],
    DefLECm243: [210, 112],
    DefLECm243O: [294, 140],
    DefHECm243: [840, 672],
    DefHECm243O: [1176, 840],
    DefLECm245: [162, 68],
    DefLECm245O: [226.8, 85],
    DefHECm245: [648, 408],
    DefHECm245O: [907.2, 510],
    DefLECm247: [138, 54],
    DefLECm247O: [193.2, 67.5],
    DefHECm247: [552, 324],
    DefHECm247O: [772.8, 405],
    DefLEB248: [135, 52],
    DefLEB248O: [189, 65],
    DefHEB248: [540, 312],
    DefHEB248O: [756, 390],
    DefLECf249: [216, 116],
    DefLECf249O: [302.4, 145],
    DefHECf249: [864, 696],
    DefHECf249O: [1209.6, 870],
    DefLECf251: [225, 120],
    DefLECf251O: [315, 150],
    DefHECf251: [900, 720],
    DefHECf251O: [1260, 900],
    E2EUraniumIngot: [600, 48],
    E2ETBU: [360, 21.6],
    E2ETBUO: [504, 27],
    E2ELEU235: [720, 60],
    E2ELEU235O: [1008, 75],
    E2EHEU235: [2880, 360],
    E2EHEU235O: [4032, 450],
    E2ELEU233: [864, 72],
    E2ELEU233O: [1209.6, 90],
    E2EHEU233: [3456, 432],
    E2EHEU233O: [4838.4, 540],
    E2ELEN236: [540, 43.2],
    E2ELEN236O: [756, 54],
    E2EHEN236: [2160, 259.2],
    E2EHEN236O: [3024, 324],
    E2EMOX239: [932.4, 69],
    E2EMOX241: [1461.6, 117],
    E2ELEP239: [630, 48],
    E2ELEP239O: [882, 60],
    E2EHEP239: [2520, 288],
    E2EHEP239O: [3528, 360],
    E2ELEP241: [990, 84],
    E2ELEP241O: [1386, 105],
    E2EHEP241: [3960, 504],
    E2EHEP241O: [5544, 630],
    E2ELEA242: [1152, 112.8],
    E2ELEA242O: [1612.8, 141],
    E2EHEA242: [4608, 676.8],
    E2EHEA242O: [6451.2, 846],
    E2ELECm243: [1260, 134.4],
    E2ELECm243O: [1764, 168],
    E2EHECm243: [5040, 806.4],
    E2EHECm243O: [7056, 1008],
    E2ELECm245: [972, 81.6],
    E2ELECm245O: [1360.8, 102],
    E2EHECm245: [3888, 489.6],
    E2EHECm245O: [5443.2, 612],
    E2ELECm247: [828, 64.8],
    E2ELECm247O: [1159.2, 81],
    E2EHECm247: [3312, 388.8],
    E2EHECm247O: [4636.8, 486],
    E2ELEB248: [810, 62.4],
    E2ELEB248O: [1134, 78],
    E2EHEB248: [3240, 374.4],
    E2EHEB248O: [4536, 468],
    E2ELECf249: [1296, 139.2],
    E2ELECf249O: [1814.4, 174],
    E2EHECf249: [5184, 835.2],
    E2EHECf249O: [7257.6, 1044],
    E2ELECf251: [1350, 144],
    E2ELECf251O: [1890, 180],
    E2EHECf251: [5400, 864],
    E2EHECf251O: [7560, 1080],
    PO3TBU: [18000, 72],
    PO3TBUO: [25200, 90],
    PO3LEU235: [36000, 200],
    PO3LEU235O: [50400, 250],
    PO3HEU235: [144000, 1200],
    PO3HEU235O: [201600, 1500],
    PO3LEU233: [43200, 240],
    PO3LEU233O: [60318, 300],
    PO3HEU233: [172800, 1440],
    PO3HEU233O: [241812, 1800],
    PO3LEN236: [27000, 144],
    PO3LEN236O: [37800, 180],
    PO3HEN236: [108000, 864],
    PO3HEN236O: [151200, 1080],
    PO3MOX239: [46512, 230],
    PO3MOX241: [72918, 390],
    PO3LEP239: [31500, 160],
    PO3LEP239O: [44100, 200],
    PO3HEP239: [126000, 960],
    PO3HEP239O: [176400, 1200],
    PO3LEP241: [49500, 280],
    PO3LEP241O: [69300, 350],
    PO3HEP241: [198000, 1680],
    PO3HEP241O: [277200, 2100],
    PO3LEA242: [57600, 376],
    PO3LEA242O: [80424, 470],
    PO3HEA242: [230400, 2256],
    PO3HEA242O: [322506, 2820],
    PO3LECm243: [63000, 448],
    PO3LECm243O: [88200, 560],
    PO3HECm243: [252000, 2688],
    PO3HECm243O: [352800, 3360],
    PO3LECm245: [48600, 272],
    PO3LECm245O: [67824, 340],
    PO3HECm245: [194400, 1632],
    PO3HECm245O: [272106, 2040],
    PO3LECm247: [41400, 216],
    PO3LECm247O: [57906, 270],
    PO3HECm247: [165600, 1296],
    PO3HECm247O: [231624, 1620],
    PO3LEB248: [40500, 208],
    PO3LEB248O: [56700, 260],
    PO3HEB248: [162000, 1248],
    PO3HEB248O: [226800, 1560],
    PO3LECf249: [64800, 464],
    PO3LECf249O: [90612, 580],
    PO3HECf249: [259200, 2784],
    PO3HECf249O: [362718, 3480],
    PO3LECf251: [67500, 480],
    PO3LECf251O: [94500, 600],
    PO3HECf251: [270000, 2880],
    PO3HECf251O: [378000, 3600]
  };
  for (const [name, [power, heat]] of Object.entries(fuelPresets)) {
    $('#' + name).click(() => {
      if (opt !== null)
        return;
      fuelBasePower.val(power);
      fuelBaseHeat.val(heat);
    });
  }
  const applyFuelFactor = (fuel, factor) => {
    if (opt !== null)
      return;
    fuelBasePower.val(fuelPresets[fuel][0] * factor);
    fuelBaseHeat.val(fuelPresets[fuel][1] * factor);
  };
  $('#br').click(() => { applyFuelFactor('DefLEU235', 8 / 9); });
  $('#ic2').click(() => { applyFuelFactor('DefLEU235', 18 / 19); });
  $('#ic2mox').click(() => { applyFuelFactor('DefMOX239', 9 / 7); });
  
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
  const loadRatePreset = (preset) => {
    if (opt !== null)
      return;
    $.each(rates, (i, x) => { x.val(preset[i]); });
  };
  loadRatePreset(ratePreset.Def);
  $('#DefRate').click(() => { loadRatePreset(ratePreset.Def); });
  $('#E2ERate').click(() => { loadRatePreset(ratePreset.E2E); });
  $('#PO3Rate').click(() => { loadRatePreset(ratePreset.PO3); });
  
  const schedule = () => {
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

  const displayTile = (tile) => {
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

  const saveTile = (tile) => {
    if (tile >= nCoolerTypes) {
      tile -= nCoolerTypes;
      if (tile < nCoolerTypes) {
        return "Active " + tileSaveNames[tile];
      }
    }
    return tileSaveNames[tile];
  };

  const displaySample = (sample) => {
    design.empty();
    let block = $('<div></div>');
    const appendInfo = (label, value, unit) => {
      const row = $('<div></div>').addClass('info');
      row.append('<div>' + label + '</div>');
      row.append('<div>' + unit + '</div>');
      row.append(Math.round(value * 100) / 100);
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
    }

    save.removeClass('disabledLink');
    save.off('click').click(() => {
      const elem = document.createElement('a');
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(saved)], {type: 'text/json'}));
      elem.setAttribute('href', url);
      elem.setAttribute('download', 'reactor.json');
      elem.click();
      window.URL.revokeObjectURL(url);
    });

    block = $('<div></div>');
    block.append('<div>Total number of blocks used</div>')
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

  run.click(() => {
    if (timeout !== null)
      return;
    if (opt === null) {
      const parseSize = (x) => {
        const result = parseInt(x);
        if (!(result > 0))
          throw Error("Core size must be a positive integer");
        return result;
      };
      const parsePositiveFloat = (name, x) => {
        const result = parseFloat(x);
        if (!(result > 0))
          throw Error(name + " must be a positive number");
        return result;
      };
      try {
        settings.sizeX = parseSize($('#sizeX').val());
        settings.sizeY = parseSize($('#sizeY').val());
        settings.sizeZ = parseSize($('#sizeZ').val());
        settings.fuelBasePower = parsePositiveFloat('Fuel Base Power', fuelBasePower.val());
        settings.fuelBaseHeat = parsePositiveFloat('Fuel Base Heat', fuelBaseHeat.val());
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
        lossElement = $('<canvas></canvas>').attr('width', 1024).attr('height', 128).insertAfter(progress);
        lossPlot = new Chart(lossElement[0].getContext('2d'), {
          type: 'bar',
          options: {responsive: false, animation: {duration: 0}, hover: {animationDuration: 0}, scales: {xAxes: [{display: false}]}, legend: {display: false}},
          data: {labels: [], datasets: [{label: 'Loss', backgroundColor: 'red', data: [], categoryPercentage: 1.0, barPercentage: 1.0}]}
        });
      }
      opt = new FissionOpt.FissionOpt(settings, useNet);
    }
    schedule();
    updateDisables();
  });

  pause.click(() => {
    if (timeout === null)
      return;
    window.clearTimeout(timeout);
    timeout = null;
    updateDisables();
  });

  stop.click(() => {
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

  reset.click(() => {
    $('input').each((_, x) => {
      if (x.type === 'text') $(x).val(x.parentNode?.parentNode?.id === 'activeLimit' && '0' || null);
      if (x.type === 'checkbox') x.checked = true
      if (x.type === 'radio') $(x).val(['0'])
    });
    loadRatePreset(ratePreset.Def);
  })

  if (typeof(Storage) !== 'undefined') {
    window.addEventListener('beforeunload', (event) => {
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
    })

    {
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
        }
      });
    }
  }
}); });
