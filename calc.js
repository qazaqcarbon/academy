// ========== SPECIES DATA ==========
const speciesData = {
    arid: [
        { id: 'poplar', name: 'Тополь', sci: 'Populus spp.', cat: 0.95 },
        { id: 'ulmus', name: 'Карагач (Вяз)', sci: 'Ulmus pumila', cat: 0.6 },
        { id: 'elaeagnus', name: 'Джида (Лох)', sci: 'Elaeagnus angustifolia', cat: 0.4 },
        { id: 'willow', name: 'Ива', sci: 'Salix spp.', cat: 0.7 },
        { id: 'maple', name: 'Клён', sci: 'Acer tataricum', cat: 0.5 },
        { id: 'acacia', name: 'Акация', sci: 'Robinia pseudoacacia', cat: 0.55 },
        { id: 'tamarix', name: 'Тамариск', sci: 'Tamarix spp.', cat: 0.3 },
        { id: 'saxaul', name: 'Саксаул', sci: 'Haloxylon spp.', cat: 0.45 }
    ],
    semiarid: [
        { id: 'poplar', name: 'Тополь', sci: 'Populus spp.', cat: 1.1 },
        { id: 'birch', name: 'Берёза', sci: 'Betula pendula', cat: 0.7 },
        { id: 'willow', name: 'Ива', sci: 'Salix spp.', cat: 0.8 },
        { id: 'maple', name: 'Клён', sci: 'Acer platanoides', cat: 0.65 },
        { id: 'pine', name: 'Сосна', sci: 'Pinus sylvestris', cat: 0.9 },
        { id: 'acacia', name: 'Акация', sci: 'Robinia pseudoacacia', cat: 0.6 },
        { id: 'linden', name: 'Липа', sci: 'Tilia cordata', cat: 0.6 },
        { id: 'elm', name: 'Вяз обыкн.', sci: 'Ulmus glabra', cat: 0.65 }
    ],
    steppe: [
        { id: 'poplar', name: 'Тополь', sci: 'Populus spp.', cat: 1.2 },
        { id: 'birch', name: 'Берёза', sci: 'Betula pendula', cat: 0.85 },
        { id: 'oak', name: 'Дуб', sci: 'Quercus robur', cat: 0.7 },
        { id: 'ash', name: 'Ясень', sci: 'Fraxinus excelsior', cat: 0.8 },
        { id: 'pine', name: 'Сосна', sci: 'Pinus sylvestris', cat: 1.05 },
        { id: 'linden', name: 'Липа', sci: 'Tilia cordata', cat: 0.7 },
        { id: 'elm', name: 'Вяз обыкн.', sci: 'Ulmus glabra', cat: 0.65 },
        { id: 'aspen', name: 'Осина', sci: 'Populus tremula', cat: 0.95 },
        { id: 'larch', name: 'Лиственница', sci: 'Larix sibirica', cat: 0.9 }
    ],
    mountain: [
        { id: 'spruce', name: 'Ель', sci: 'Picea schrenkiana', cat: 1.3 },
        { id: 'fir', name: 'Пихта', sci: 'Abies sibirica', cat: 1.1 },
        { id: 'oak', name: 'Дуб', sci: 'Quercus spp.', cat: 0.85 },
        { id: 'maple', name: 'Клён', sci: 'Acer semenovii', cat: 0.7 },
        { id: 'walnut', name: 'Грецкий орех', sci: 'Juglans regia', cat: 0.75 },
        { id: 'apple', name: 'Яблоня', sci: 'Malus sieversii', cat: 0.5 },
        { id: 'poplar', name: 'Тополь', sci: 'Populus tremula', cat: 1.0 },
        { id: 'larch', name: 'Лиственница', sci: 'Larix sibirica', cat: 1.15 },
        { id: 'cedar', name: 'Кедр (Сиб. сосна)', sci: 'Pinus sibirica', cat: 1.2 },
        { id: 'aspen', name: 'Осина', sci: 'Populus tremula', cat: 0.9 }
    ]
};

// Biomass accumulation (tC/ha) by year for each climate zone
// Based on IPCC 2006 GL for forestry, table 4.14 adapted
const growthCurves = {
    arid: [8, 22, 42, 65, 85, 100, 120, 135],
    semiarid: [12, 32, 60, 90, 115, 135, 160, 180],
    steppe: [18, 48, 88, 130, 165, 195, 235, 265],
    mountain: [20, 55, 100, 148, 190, 225, 270, 305],
};

function buildSpecies(zone) {
    const sel = document.getElementById('speciesSelector');
    if (!sel) return;
    sel.innerHTML = '';
    const species = speciesData[zone];
    species.forEach(sp => {
        const lbl = document.createElement('label');
        lbl.className = 'species-check';
        lbl.innerHTML = `
            <input type="checkbox" value="${sp.id}" onchange="onSpeciesChange()">
            <div class="checkmark"></div>
            <div>
                <div class="sp-name">${sp.name}</div>
                <div class="sp-sci">${sp.sci}</div>
            </div>
        `;
        lbl.querySelector('input').addEventListener('change', function () {
            lbl.classList.toggle('selected', this.checked);
            const checkIcon = lbl.querySelector('.checkmark');
            if (this.checked) {
                checkIcon.innerHTML = '✓';
            } else {
                checkIcon.innerHTML = '';
            }
        });
        sel.appendChild(lbl);
    });
}

function onSpeciesChange() {
    const count = document.querySelectorAll('#speciesSelector input:checked').length;
    document.getElementById('speciesWarning').style.display = count < 5 ? 'block' : 'none';
}

function onParamChange() {
    const zone = document.getElementById('climateZone').value;
    buildSpecies(zone);
}

function syncRange(param) {
    const range = document.getElementById(param + 'Range');
    const num = document.getElementById(param + 'Num');
    const val = document.getElementById(param + 'Val');
    num.value = range.value;
    const min = parseFloat(range.min), max = parseFloat(range.max), v = parseFloat(range.value);
    const pct = ((v - min) / (max - min) * 100).toFixed(1) + '%';
    range.style.setProperty('--val', pct);
    if (param === 'area') val.textContent = range.value + ' га';
    else if (param === 'density') val.textContent = range.value;
    else val.textContent = range.value + ' лет';
}

function syncNum(param) {
    const range = document.getElementById(param + 'Range');
    const num = document.getElementById(param + 'Num');
    const val = document.getElementById(param + 'Val');
    let v = parseFloat(num.value);
    v = Math.min(Math.max(v, parseFloat(range.min)), parseFloat(range.max));
    range.value = v;
    const min = parseFloat(range.min), max = parseFloat(range.max);
    const pct = ((v - min) / (max - min) * 100).toFixed(1) + '%';
    range.style.setProperty('--val', pct);
    if (param === 'area') val.textContent = v + ' га';
    else if (param === 'density') val.textContent = v;
    else val.textContent = v + ' лет';
}

// ========== CALCULATION ==========
function interpolateBiomass(zone, years) {
    const checkpoints = [10, 20, 30, 40, 50, 60, 80, 100];
    const values = growthCurves[zone];
    if (years <= 10) return values[0] * (years / 10);
    if (years >= 100) return values[7];
    for (let i = 0; i < checkpoints.length - 1; i++) {
        if (years >= checkpoints[i] && years <= checkpoints[i + 1]) {
            const t = (years - checkpoints[i]) / (checkpoints[i + 1] - checkpoints[i]);
            return values[i] + t * (values[i + 1] - values[i]);
        }
    }
    return values[7];
}

function calculate() {
    const zone = document.getElementById('climateZone').value;
    const type = document.getElementById('projectType').value;
    const area = parseFloat(document.getElementById('areaNum').value);
    const density = parseFloat(document.getElementById('densityNum').value);
    const years = parseFloat(document.getElementById('lifeNum').value);

    const checkedSpecies = document.querySelectorAll('#speciesSelector input:checked');
    if (checkedSpecies.length < 5) {
        document.getElementById('speciesWarning').style.display = 'block';
        return;
    } else {
        document.getElementById('speciesWarning').style.display = 'none';
    }

    // Base biomass at end of project (tC/ha)
    let baseCarbon = interpolateBiomass(zone, years);

    // Type modifier
    const typeMod = { arr: 1.0, agroforest: 0.62, windbreak: 0.55 };
    baseCarbon *= typeMod[type];

    // Density modifier (baseline 833 trees/ha)
    const densityMod = Math.min(Math.max(density / 833, 0.4), 1.8);
    baseCarbon *= densityMod;

    // Species diversity bonus
    const speciesBonus = 1 + (checkedSpecies.length - 5) * 0.02;
    baseCarbon *= speciesBonus;

    // Total carbon in biomass at end of project (tonnes C)
    const totalC = baseCarbon * area;

    // CO2 equivalent (1 tC = 3.667 tCO2e)
    const totalCO2e = totalC * 3.667;
    const annualCO2e = totalCO2e / years;
    const totalTrees = area * density;
    const timberEst = totalC * 2.8;

    renderResults({
        zone, type, area, density, years,
        totalC, totalCO2e, annualCO2e, totalTrees, timberEst, baseCarbon, checkedSpecies: checkedSpecies.length
    });
}

function renderResults(r) {
    const container = document.getElementById('calcResults');

    const typeNames = {
        arr: 'Лесовосстановление (ARR)',
        agroforest: 'Агролесоводство',
        windbreak: 'Ветрозащитные полосы'
    };
    const zoneNames = {
        arid: 'Аридная',
        semiarid: 'Полуаридная',
        steppe: 'Степная',
        mountain: 'Горная / Субальпийская'
    };

    // Build timeline bar data
    const checkpoints = [10, 20, 30, 40, 50, 60, 80, 100].filter(y => y <= r.years + 10);
    const maxC = interpolateBiomass(r.zone, Math.min(r.years + 10, 100)) * r.area * { arr: 1.0, agroforest: 0.62, windbreak: 0.55 }[r.type];
    const barData = checkpoints.map(y => ({
        year: y,
        c: Math.min(interpolateBiomass(r.zone, y) * r.area * { arr: 1.0, agroforest: 0.62, windbreak: 0.55 }[r.type], r.totalC * 1.05)
    }));

    const barsHTML = barData.map(b => {
        const h = Math.max(4, (b.c / (maxC * 1.1)) * 80);
        const co2 = (b.c * 3.667).toFixed(0);
        return `<div class="timeline-year" style="height:${h}px;opacity:${b.year <= r.years ? 1 : 0.4}" 
      data-tip="Год ${b.year}: ${b.c.toFixed(0)} tC / ${co2} tCO₂e"></div>`;
    }).join('');

    const labelsHTML = barData.map(b => `<span>${b.year}г</span>`).join('');

    container.innerHTML = `
    <div class="results-header">
      <h3>Результаты расчёта</h3>
      <p>${typeNames[r.type]} · ${zoneNames[r.zone]} · ${r.area} га · ${r.years} лет · ${r.checkedSpecies} пород</p>
    </div>

    <div class="result-card" style="border-left-color:var(--brand-blue)">
      <div class="result-label">Секвестированный Углерод (Биомасса)</div>
      <div class="result-number">${r.totalC.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
      <div class="result-unit">тонн углерода (tC) к ${r.years}-му году</div>
    </div>

    <div class="result-card highlight">
      <div class="result-label">Углеродные единицы (CO₂-эквивалент)</div>
      <div class="result-number">${r.totalCO2e.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
      <div class="result-unit">Возможных tCO₂e к ${r.years}-му году</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div class="result-card" style="padding:1.4rem">
        <div class="result-label">Среднегодовая квота</div>
        <div class="result-number" style="font-size:1.8rem">${r.annualCO2e.toFixed(0)}</div>
        <div class="result-unit">tCO₂e / год</div>
      </div>
      <div class="result-card" style="padding:1.4rem">
        <div class="result-label">Кол-во саженцев</div>
        <div class="result-number" style="font-size:1.8rem">${r.totalTrees.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
        <div class="result-unit">деревьев</div>
      </div>
    </div>

    <div class="timeline-bar">
      <h4>Накопление углерода (tC)</h4>
      <div class="timeline-years">${barsHTML}</div>
      <div class="timeline-labels">${labelsHTML}</div>
    </div>

    <div class="methodology">
      <h4>О методологии</h4>
      <p>
        Расчет базируется на IPCC 2006 (умеренный/аридный климат). Конверсия: C → CO₂e × 3.667. 
        Учитывается только надземная биомасса деревьев. Применены понижающие коэффициенты для типов: 아гролес (×0.62) и защитные полосы (×0.55). Разнообразие пород (>5 шт.) положительно влияет на расчет. Консультируйтесь с нами для точного PDD аудита.
      </p>
    </div>
  `;

    // Animate cards in
    setTimeout(() => {
        container.querySelectorAll('.result-card').forEach((c, i) => {
            setTimeout(() => c.classList.add('visible'), i * 100);
        });
    }, 50);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('speciesSelector')) {
        buildSpecies('arid');
    }
});
