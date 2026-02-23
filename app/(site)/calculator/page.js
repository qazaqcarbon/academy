"use client";
import React, { useState, useEffect } from "react";
import styles from "./calculator.module.css";
import RevealOnScroll from "../../../components/RevealOnScroll";

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

const growthCurves = {
    arid: [8, 22, 42, 65, 85, 100, 120, 135],
    semiarid: [12, 32, 60, 90, 115, 135, 160, 180],
    steppe: [18, 48, 88, 130, 165, 195, 235, 265],
    mountain: [20, 55, 100, 148, 190, 225, 270, 305],
};

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

export default function CalculatorPage() {
    const [projectType, setProjectType] = useState("arr");
    const [climateZone, setClimateZone] = useState("arid");
    const [area, setArea] = useState(42);
    const [density, setDensity] = useState(833);
    const [life, setLife] = useState(40);
    const [selectedSpecies, setSelectedSpecies] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [results, setResults] = useState(null);

    // Clear selected species when climate zone changes
    useEffect(() => {
        setSelectedSpecies([]);
    }, [climateZone]);

    const handleSpeciesToggle = (id) => {
        setSelectedSpecies(prev => {
            if (prev.includes(id)) {
                return prev.filter(s => s !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    useEffect(() => {
        if (selectedSpecies.length > 0 && selectedSpecies.length < 5) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
        }
    }, [selectedSpecies]);

    const handleCalculate = () => {
        if (selectedSpecies.length < 5) {
            setShowWarning(true);
            return;
        }
        setShowWarning(false);

        let baseCarbon = interpolateBiomass(climateZone, life);
        const typeMod = { arr: 1.0, agroforest: 0.62, windbreak: 0.55 };
        baseCarbon *= typeMod[projectType];

        const densityMod = Math.min(Math.max(density / 833, 0.4), 1.8);
        baseCarbon *= densityMod;

        const speciesBonus = 1 + (selectedSpecies.length - 5) * 0.02;
        baseCarbon *= speciesBonus;

        const totalC = baseCarbon * area;
        const totalCO2e = totalC * 3.667;
        const annualCO2e = totalCO2e / life;
        const totalTrees = area * density;
        const timberEst = totalC * 2.8;

        setResults({
            zone: climateZone,
            type: projectType,
            area,
            density,
            years: life,
            totalC,
            totalCO2e,
            annualCO2e,
            totalTrees,
            timberEst,
            baseCarbon,
            checkedSpecies: selectedSpecies.length
        });
    };

    return (
        <main>
            <header className="hero" style={{ minHeight: '50vh', paddingTop: '150px', paddingBottom: '80px' }}>
                <div className="hero-bg-accent"></div>
                <div className="container hero-content" style={{ maxWidth: '900px', textAlign: 'center', margin: '0 auto' }}>
                    <div className="hero-badge" style={{ margin: '0 auto 1.5rem auto' }}>Калькулятор посадок ARR</div>
                    <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>
                        Рассчитайте <span className="text-highlight">углеродный потенциал</span>
                    </h1>
                    <p className="hero-subtitle" style={{ margin: '0 auto' }}>
                        Оцените приблизительное количество углеродных единиц (tCO₂e) для вашего агролесного проекта.
                        Моделирование осуществляется по методологии IPCC (2006).
                    </p>
                </div>
            </header>

            <section className="section bg-light" style={{ paddingTop: '80px' }}>
                <div className="container">
                    <div className={styles.calcWrapper}>
                        <RevealOnScroll>
                            <div className={styles.calcForm}>
                                <h3>Параметры участка</h3>
                                <div className={styles.formGroup}>
                                    <label>Тип проекта</label>
                                    <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                                        <option value="arr">Лесовосстановление / Облесение (ARR)</option>
                                        <option value="agroforest">Агролесоводство (деревья + культуры)</option>
                                        <option value="windbreak">Ветрозащитные лесополосы</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Климатическая зона / Регион</label>
                                    <select value={climateZone} onChange={(e) => setClimateZone(e.target.value)}>
                                        <option value="arid">Аридная (Кызылорда, Арал, Туркестан)</option>
                                        <option value="semiarid">Полуаридная (Актобе, Костанай, Павлодар)</option>
                                        <option value="steppe">Степная (Акмола, Карагандинская, СКО)</option>
                                        <option value="mountain">Горная / Субальпийская (Алматинская, ВКО)</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Площадь посадок (гектаров)</label>
                                    <div className={styles.rangeWrap}>
                                        <input type="range" min="1" max="500" value={area} onChange={(e) => setArea(Number(e.target.value))} style={{ '--val': `${((area - 1) / 499) * 100}%` }} />
                                        <span className={styles.rangeVal}>{area} га</span>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Плотность посадки (деревьев / га)</label>
                                    <div className={styles.rangeWrap}>
                                        <input type="range" min="100" max="2500" value={density} onChange={(e) => setDensity(Number(e.target.value))} style={{ '--val': `${((density - 100) / 2400) * 100}%` }} />
                                        <span className={styles.rangeVal}>{density}</span>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Срок проекта (лет)</label>
                                    <div className={styles.rangeWrap}>
                                        <input type="range" min="40" max="100" value={life} onChange={(e) => setLife(Number(e.target.value))} style={{ '--val': `${((life - 40) / 60) * 100}%` }} />
                                        <span className={styles.rangeVal}>{life} лет</span>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Породы деревьев (выберите минимум 5)</label>
                                    <div className={styles.speciesSelector}>
                                        {speciesData[climateZone].map((sp) => (
                                            <label
                                                key={sp.id}
                                                className={`${styles.speciesCheck} ${selectedSpecies.includes(sp.id) ? styles.selected : ''}`}
                                            >
                                                <input type="checkbox" checked={selectedSpecies.includes(sp.id)} onChange={() => handleSpeciesToggle(sp.id)} />
                                                <div className={styles.checkmark}>{selectedSpecies.includes(sp.id) ? "✓" : ""}</div>
                                                <div>
                                                    <div className={styles.spName}>{sp.name}</div>
                                                    <div className={styles.spSci}>{sp.sci}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {showWarning && (
                                        <div className={styles.speciesWarning} style={{ display: 'block' }}>
                                            ⚠ Пожалуйста, выберите минимум 5 пород. (Это повышает устойчивость леса и увеличивает секвестрацию).
                                        </div>
                                    )}
                                </div>

                                <button className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', marginTop: '1rem', padding: '1.2rem' }} onClick={handleCalculate}>
                                    Рассчитать онлайн
                                </button>
                                <div className={styles.note}>
                                    Моделирование основано на коэффициентах роста биомассы IPCC (2006). Данные носят ориентировочный характер для принятия решений. Точный расчет возможен только после разработки PDD.
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.2}>
                            <div className={styles.calcResults}>
                                {!results ? (
                                    <div className={styles.placeholderState}>
                                        <div className={styles.icon}>📊</div>
                                        <p>Укажите параметры вашего участка слева<br />и нажмите «Рассчитать онлайн»</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.resultsHeader}>
                                            <h3>Результаты расчёта</h3>
                                            <p>
                                                {{ arr: 'Лесовосстановление (ARR)', agroforest: 'Агролесоводство', windbreak: 'Ветрозащитные полосы' }[results.type]} ·
                                                {{ arid: 'Аридная', semiarid: 'Полуаридная', steppe: 'Степная', mountain: 'Горная / Субальпийская' }[results.zone]} ·
                                                {results.area} га · {results.years} лет · {results.checkedSpecies} пород
                                            </p>
                                        </div>

                                        <div className={`${styles.resultCard} ${styles.visible}`} style={{ borderLeftColor: 'var(--brand-blue)' }}>
                                            <div className={styles.resultLabel}>Секвестированный Углерод (Биомасса)</div>
                                            <div className={styles.resultNumber}>{results.totalC.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
                                            <div className={styles.resultUnit}>тонн углерода (tC) к {results.years}-му году</div>
                                        </div>

                                        <div className={`${styles.resultCard} ${styles.visible} ${styles.highlight}`}>
                                            <div className={styles.resultLabel}>Углеродные единицы (CO₂-эквивалент)</div>
                                            <div className={styles.resultNumber}>{results.totalCO2e.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
                                            <div className={styles.resultUnit}>Возможных tCO₂e к {results.years}-му году</div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className={`${styles.resultCard} ${styles.visible}`} style={{ padding: '1.4rem' }}>
                                                <div className={styles.resultLabel}>Среднегодовая квота</div>
                                                <div className={styles.resultNumber} style={{ fontSize: '1.8rem' }}>{results.annualCO2e.toFixed(0)}</div>
                                                <div className={styles.resultUnit}>tCO₂e / год</div>
                                            </div>
                                            <div className={`${styles.resultCard} ${styles.visible}`} style={{ padding: '1.4rem' }}>
                                                <div className={styles.resultLabel}>Кол-во саженцев</div>
                                                <div className={styles.resultNumber} style={{ fontSize: '1.8rem' }}>{results.totalTrees.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
                                                <div className={styles.resultUnit}>деревьев</div>
                                            </div>
                                        </div>

                                        <div className={styles.timelineBar}>
                                            <h4>Накопление углерода (tC)</h4>
                                            <div className={styles.timelineYears}>
                                                {[10, 20, 30, 40, 50, 60, 80, 100].filter(y => y <= results.years + 10).map((year) => {
                                                    const cVal = interpolateBiomass(results.zone, year) * results.area * { arr: 1.0, agroforest: 0.62, windbreak: 0.55 }[results.type];
                                                    const maxC = interpolateBiomass(results.zone, Math.min(results.years + 10, 100)) * results.area * { arr: 1.0, agroforest: 0.62, windbreak: 0.55 }[results.type];
                                                    const h = Math.max(4, (cVal / (maxC * 1.1)) * 80);
                                                    const co2 = (cVal * 3.667).toFixed(0);
                                                    return (
                                                        <div
                                                            key={year}
                                                            className={styles.timelineYear}
                                                            style={{ height: `${h}px`, opacity: year <= results.years ? 1 : 0.4 }}
                                                            data-tip={`Год ${year}: ${cVal.toFixed(0)} tC / ${co2} tCO₂e`}
                                                        ></div>
                                                    );
                                                })}
                                            </div>
                                            <div className={styles.timelineLabels}>
                                                {[10, 20, 30, 40, 50, 60, 80, 100].filter(y => y <= results.years + 10).map((year) => (
                                                    <span key={year}>{year}г</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.methodology}>
                                            <h4>О методологии</h4>
                                            <p>
                                                Расчет базируется на IPCC 2006 (умеренный/аридный климат). Конверсия: C → CO₂e × 3.667.
                                                Учитывается только надземная биомасса деревьев. Применены понижающие коэффициенты для типов: агролес (×0.62) и защитные полосы (×0.55). Разнообразие пород (≥5 шт.) положительно влияет на расчет. Консультируйтесь с нами для точного PDD аудита.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>
        </main>
    );
}
