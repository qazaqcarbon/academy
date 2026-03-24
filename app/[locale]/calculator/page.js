"use client";
import React, { useState, useEffect } from "react";
import styles from "./calculator.module.css";
import RevealOnScroll from "../../../components/RevealOnScroll";
import { useTranslations } from "next-intl";
import { client } from "../../../sanity/client";

const speciesData = {
    arid: [
        { id: 'poplar', name: 'Тополь / Poplar', sci: 'Populus spp.', cat: 0.95 },
        { id: 'ulmus', name: 'Карагач / Elm', sci: 'Ulmus pumila', cat: 0.6 },
        { id: 'elaeagnus', name: 'Джида / Oleaster', sci: 'Elaeagnus angustifolia', cat: 0.4 },
        { id: 'willow', name: 'Ива / Willow', sci: 'Salix spp.', cat: 0.7 },
        { id: 'maple', name: 'Клён / Maple', sci: 'Acer tataricum', cat: 0.5 },
        { id: 'acacia', name: 'Акация / Acacia', sci: 'Robinia pseudoacacia', cat: 0.55 },
        { id: 'tamarix', name: 'Тамариск / Tamarisk', sci: 'Tamarix spp.', cat: 0.3 },
        { id: 'saxaul', name: 'Саксаул / Saxaul', sci: 'Haloxylon spp.', cat: 0.45 }
    ],
    semiarid: [
        { id: 'poplar', name: 'Тополь / Poplar', sci: 'Populus spp.', cat: 1.1 },
        { id: 'birch', name: 'Берёза / Birch', sci: 'Betula pendula', cat: 0.7 },
        { id: 'willow', name: 'Ива / Willow', sci: 'Salix spp.', cat: 0.8 },
        { id: 'maple', name: 'Клён / Maple', sci: 'Acer platanoides', cat: 0.65 },
        { id: 'pine', name: 'Сосна / Pine', sci: 'Pinus sylvestris', cat: 0.9 },
        { id: 'acacia', name: 'Акация / Acacia', sci: 'Robinia pseudoacacia', cat: 0.6 },
        { id: 'linden', name: 'Липа / Linden', sci: 'Tilia cordata', cat: 0.6 },
        { id: 'elm', name: 'Вяз / Elm', sci: 'Ulmus glabra', cat: 0.65 }
    ],
    steppe: [
        { id: 'poplar', name: 'Тополь / Poplar', sci: 'Populus spp.', cat: 1.2 },
        { id: 'birch', name: 'Берёза / Birch', sci: 'Betula pendula', cat: 0.85 },
        { id: 'oak', name: 'Дуб / Oak', sci: 'Quercus robur', cat: 0.7 },
        { id: 'ash', name: 'Ясень / Ash', sci: 'Fraxinus excelsior', cat: 0.8 },
        { id: 'pine', name: 'Сосна / Pine', sci: 'Pinus sylvestris', cat: 1.05 },
        { id: 'linden', name: 'Липа / Linden', sci: 'Tilia cordata', cat: 0.7 },
        { id: 'elm', name: 'Вяз / Elm', sci: 'Ulmus glabra', cat: 0.65 },
        { id: 'aspen', name: 'Осина / Aspen', sci: 'Populus tremula', cat: 0.95 },
        { id: 'larch', name: 'Лиственница / Larch', sci: 'Larix sibirica', cat: 0.9 }
    ],
    mountain: [
        { id: 'spruce', name: 'Ель / Spruce', sci: 'Picea schrenkiana', cat: 1.3 },
        { id: 'fir', name: 'Пихта / Fir', sci: 'Abies sibirica', cat: 1.1 },
        { id: 'oak', name: 'Дуб / Oak', sci: 'Quercus spp.', cat: 0.85 },
        { id: 'maple', name: 'Клён / Maple', sci: 'Acer semenovii', cat: 0.7 },
        { id: 'walnut', name: 'Грецкий орех / Walnut', sci: 'Juglans regia', cat: 0.75 },
        { id: 'apple', name: 'Яблоня / Apple', sci: 'Malus sieversii', cat: 0.5 },
        { id: 'poplar', name: 'Тополь / Poplar', sci: 'Populus tremula', cat: 1.0 },
        { id: 'larch', name: 'Лиственница / Larch', sci: 'Larix sibirica', cat: 1.15 },
        { id: 'cedar', name: 'Кедр / Cedar', sci: 'Pinus sibirica', cat: 1.2 },
        { id: 'aspen', name: 'Осина / Aspen', sci: 'Populus tremula', cat: 0.9 }
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
    const t = useTranslations("Calculator");
    const [projectType, setProjectType] = useState("arr");
    const [climateZone, setClimateZone] = useState("arid");
    const [area, setArea] = useState(1000);
    const [density, setDensity] = useState(833);
    const [life, setLife] = useState(40);
    const [selectedSpecies, setSelectedSpecies] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [results, setResults] = useState(null);
    const [marketPrices, setMarketPrices] = useState({ low: 5, base: 15, high: 30 });

    useEffect(() => {
        async function fetchPrices() {
            try {
                const data = await client.fetch(`*[_type == "carbonPrices"][0]`);
                if (data && data.low && data.base && data.high) {
                    setMarketPrices({ low: data.low, base: data.base, high: data.high });
                }
            } catch (err) {
                console.error("Failed to load prices", err);
            }
        }
        fetchPrices();
    }, []);

    useEffect(() => {
        setSelectedSpecies([]);
    }, [climateZone]);

    const handleSpeciesToggle = (id) => {
        setSelectedSpecies(prev => {
            if (prev.includes(id)) return prev.filter(s => s !== id);
            else return [...prev, id];
        });
    };

    useEffect(() => {
        setShowWarning(selectedSpecies.length > 0 && selectedSpecies.length < 5);
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
            baseCarbon,
            checkedSpecies: selectedSpecies.length
        });
    };

    const typeNames = {
        arr: t("typeNames.arr"),
        agroforest: t("typeNames.agroforest"),
        windbreak: t("typeNames.windbreak")
    };
    const zoneNames = {
        arid: t("zoneNames.arid"),
        semiarid: t("zoneNames.semiarid"),
        steppe: t("zoneNames.steppe"),
        mountain: t("zoneNames.mountain")
    };

    return (
        <main>
            <header className="hero" style={{ minHeight: '50vh', paddingTop: '150px', paddingBottom: '80px' }}>
                <div className="hero-bg-accent"></div>
                <div className="container hero-content" style={{ maxWidth: '900px', textAlign: 'center', margin: '0 auto' }}>
                    <div className="hero-badge" style={{ margin: '0 auto 1.5rem auto' }}>{t("heroBadge")}</div>
                    <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>
                        {t("heroTitle1")} <span className="text-highlight">{t("heroTitle2")}</span>
                    </h1>
                    <p className="hero-subtitle" style={{ margin: '0 auto' }}>{t("heroDesc")}</p>
                </div>
            </header>

            <section className="section bg-light" style={{ paddingTop: '80px' }}>
                <div className="container">
                    <div className={styles.calcWrapper}>
                        <RevealOnScroll>
                            <div className={styles.calcForm}>
                                <h3>{t("formTitle")}</h3>
                                <div className={styles.formGroup}>
                                    <label>{t("projectTypeLabel")}</label>
                                    <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                                        <option value="arr">{t("projectTypeArr")}</option>
                                        <option value="agroforest">{t("projectTypeAgroforest")}</option>
                                        <option value="windbreak">{t("projectTypeWindbreak")}</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t("climateZoneLabel")}</label>
                                    <select value={climateZone} onChange={(e) => setClimateZone(e.target.value)}>
                                        <option value="arid">{t("climateZoneArid")}</option>
                                        <option value="semiarid">{t("climateZoneSemiarid")}</option>
                                        <option value="steppe">{t("climateZoneSteppe")}</option>
                                        <option value="mountain">{t("climateZoneMountain")}</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t("areaLabel")}</label>
                                    <div className={styles.rangeWrap}>
                                        <input type="range" min="1" max="5000" value={area} onChange={(e) => setArea(Number(e.target.value))} style={{ '--val': `${((area - 1) / 4999) * 100}%` }} />
                                        <span className={styles.rangeVal}>{area} {t("areaUnit")}</span>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t("densityLabel")}</label>
                                    <div className={styles.rangeWrap}>
                                        <input type="range" min="100" max="2500" value={density} onChange={(e) => setDensity(Number(e.target.value))} style={{ '--val': `${((density - 100) / 2400) * 100}%` }} />
                                        <span className={styles.rangeVal}>{density}</span>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t("lifeLabel")}</label>
                                    <div className={styles.rangeWrap}>
                                        <input type="range" min="40" max="100" value={life} onChange={(e) => setLife(Number(e.target.value))} style={{ '--val': `${((life - 40) / 60) * 100}%` }} />
                                        <span className={styles.rangeVal}>{life} {t("lifeUnit")}</span>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t("speciesLabel")}</label>
                                    <div className={styles.speciesSelector}>
                                        {speciesData[climateZone].map((sp) => (
                                            <label key={sp.id} className={`${styles.speciesCheck} ${selectedSpecies.includes(sp.id) ? styles.selected : ''}`}>
                                                <input type="checkbox" checked={selectedSpecies.includes(sp.id)} onChange={() => handleSpeciesToggle(sp.id)} />
                                                <div className={styles.checkmark}>{selectedSpecies.includes(sp.id) ? "✓" : ""}</div>
                                                <div>
                                                    <div className={styles.spName}>{sp.name}</div>
                                                    <div className={styles.spSci}>{sp.sci}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {showWarning && <div className={styles.speciesWarning} style={{ display: 'block' }}>{t("speciesWarning")}</div>}
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', marginTop: '1rem', padding: '1.2rem' }} onClick={handleCalculate}>{t("calcButton")}</button>
                                <div className={styles.note}>{t("calcNote")}</div>
                            </div>
                        </RevealOnScroll>
                        <RevealOnScroll delay={0.2}>
                            <div className={styles.calcResults}>
                                {!results ? (
                                    <div className={styles.placeholderState}>
                                        <div className={styles.icon}>📊</div>
                                        <p>{t("placeholderText")}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.resultsHeader}>
                                            <h3>{t("resultsTitle")}</h3>
                                            <p>{typeNames[results.type]} · {zoneNames[results.zone]} · {results.area} {t("areaUnit")} · {results.years} {t("lifeUnit")} · {results.checkedSpecies} {t("speciesCount", { count: results.checkedSpecies })}</p>
                                        </div>
                                        <div className={`${styles.resultCard} ${styles.visible}`} style={{ borderLeftColor: 'var(--brand-blue)' }}>
                                            <div className={styles.resultLabel}>{t("cardCarbonLabel")}</div>
                                            <div className={styles.resultNumber}>{results.totalC.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
                                            <div className={styles.resultUnit}>{t("cardCarbonUnit", { years: results.years })}</div>
                                        </div>
                                        <div className={`${styles.resultCard} ${styles.visible} ${styles.highlight}`}>
                                            <div className={styles.resultLabel}>{t("cardCO2Label")}</div>
                                            <div className={styles.resultNumber}>{results.totalCO2e.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
                                            <div className={styles.resultUnit}>{t("cardCO2Unit", { years: results.years })}</div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className={`${styles.resultCard} ${styles.visible}`} style={{ padding: '1.4rem' }}>
                                                <div className={styles.resultLabel}>{t("cardAnnualLabel")}</div>
                                                <div className={styles.resultNumber} style={{ fontSize: '1.8rem' }}>{results.annualCO2e.toFixed(0)}</div>
                                                <div className={styles.resultUnit}>{t("cardAnnualUnit")}</div>
                                            </div>
                                            <div className={`${styles.resultCard} ${styles.visible}`} style={{ padding: '1.4rem' }}>
                                                <div className={styles.resultLabel}>{t("cardTreesLabel")}</div>
                                                <div className={styles.resultNumber} style={{ fontSize: '1.8rem' }}>{results.totalTrees.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div>
                                                <div className={styles.resultUnit}>{t("cardTreesUnit")}</div>
                                            </div>
                                        </div>
                                        <div className={styles.timelineBar}>
                                            <h4>{t("barTitle")}</h4>
                                            <div className={styles.timelineYears}>
                                                {[5, 10, 15, 20, 25, 30, 35, 40].filter(y => y <= results.years + 5).map((year) => {
                                                    const baseCarbon = interpolateBiomass(results.zone, year);
                                                    const typeMod = { arr: 1.0, agroforest: 0.62, windbreak: 0.55 }[results.type];
                                                    const densityMod = Math.min(Math.max(results.density / 833, 0.4), 1.8);
                                                    const speciesBonus = 1 + (results.checkedSpecies >= 5 ? results.checkedSpecies - 5 : 0) * 0.02;
                                                    
                                                    const cVal = baseCarbon * typeMod * densityMod * speciesBonus * results.area;
                                                    const co2eVal = cVal * 3.667;
                                                    
                                                    const maxNodeC = interpolateBiomass(results.zone, Math.min(results.years + 5, 40));
                                                    const maxC = maxNodeC * typeMod * densityMod * speciesBonus * results.area;
                                                    
                                                    const h = Math.max(4, (cVal / (maxC * 1.1)) * 80);
                                                    return <div key={year} className={styles.timelineYear} data-tip={`${co2eVal.toFixed(0)} tCO₂e`} style={{ height: `${h}px`, opacity: year <= results.years ? 1 : 0.4 }}></div>;
                                                })}
                                            </div>
                                            <div className={styles.timelineLabels}>
                                                {[5, 10, 15, 20, 25, 30, 35, 40].filter(y => y <= results.years + 5).map((year) => (
                                                    <span key={year}>{t("yearLabel", { years: year })}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={styles.methodology}>
                                            <h4>{t("methodTitle")}</h4>
                                            <p>{t("methodDesc")}</p>
                                        </div>

                                        <div className={styles.incomeSection}>
                                            <h3>{t("incomeTitle")}</h3>
                                            <p className={styles.incomeDesc}>{t("incomeDesc")}</p>
                                            
                                            <div className={styles.incomeCards}>
                                                <div className={styles.incomeCard}>
                                                    <div className={styles.incomeHeader}>{t("priceLowName")}</div>
                                                    <div className={styles.priceTag}>${marketPrices.low} <span style={{fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)'}}>/ tCO₂e</span></div>
                                                    <div className={styles.incomeValue}>
                                                        <div className={styles.incomeLabel}>{t("incomeTotal")}</div>
                                                        <div className={styles.incomeNum}>${(results.totalCO2e * marketPrices.low).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                                                    </div>
                                                    <div className={styles.incomeAnnual}>
                                                        <span>{t("incomeAnnual")}</span>
                                                        <strong>${((results.totalCO2e * marketPrices.low) / results.years).toLocaleString('en-US', {maximumFractionDigits: 0})}</strong>
                                                    </div>
                                                </div>

                                                <div className={`${styles.incomeCard} ${styles.incomeBase}`}>
                                                    <div className={styles.incomeHeader}>{t("priceBaseName")}</div>
                                                    <div className={styles.priceTag} style={{color: 'var(--brand-yellow)'}}>${marketPrices.base} <span style={{fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)'}}>/ tCO₂e</span></div>
                                                    <div className={styles.incomeValue}>
                                                        <div className={styles.incomeLabel}>{t("incomeTotal")}</div>
                                                        <div className={styles.incomeNum} style={{color: 'white'}}>${(results.totalCO2e * marketPrices.base).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                                                    </div>
                                                    <div className={styles.incomeAnnual}>
                                                        <span>{t("incomeAnnual")}</span>
                                                        <strong style={{color: 'white'}}>${((results.totalCO2e * marketPrices.base) / results.years).toLocaleString('en-US', {maximumFractionDigits: 0})}</strong>
                                                    </div>
                                                </div>

                                                <div className={styles.incomeCard}>
                                                    <div className={styles.incomeHeader}>{t("priceHighName")}</div>
                                                    <div className={styles.priceTag}>${marketPrices.high} <span style={{fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)'}}>/ tCO₂e</span></div>
                                                    <div className={styles.incomeValue}>
                                                        <div className={styles.incomeLabel}>{t("incomeTotal")}</div>
                                                        <div className={styles.incomeNum}>${(results.totalCO2e * marketPrices.high).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                                                    </div>
                                                    <div className={styles.incomeAnnual}>
                                                        <span>{t("incomeAnnual")}</span>
                                                        <strong>${((results.totalCO2e * marketPrices.high) / results.years).toLocaleString('en-US', {maximumFractionDigits: 0})}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.note} style={{marginTop: '1.5rem', opacity: 0.8}}>
                                                {t("incomeExplanation")}
                                            </div>
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
