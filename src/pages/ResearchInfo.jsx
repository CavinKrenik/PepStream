import React, { useState, useMemo } from 'react'
import { PRODUCTS } from '../data/products'

export default function ResearchInfo() {
    // Filter only products that have research info
    const researchProducts = useMemo(
        () => PRODUCTS.filter(p => p.researchInfo),
        []
    )

    const [selectedId, setSelectedId] = useState(
        researchProducts[0]?.id || null
    )

    const selectedProduct = useMemo(
        () => researchProducts.find(p => p.id === selectedId),
        [selectedId, researchProducts]
    )

    if (!selectedProduct) return null

    return (
        <main className="container" style={{ maxWidth: '1200px', paddingBottom: '60px' }}>
            <h1 className="title" style={{ marginTop: '40px' }}>Research Information</h1>

            <div
                style={{
                    background: '#1e293b',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    margin: '20px 0',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#e2e8f0',
                }}
            >
                The compounds listed below are provided strictly for <strong>laboratory research use by qualified professionals</strong>.
                No medical, diagnostic, therapeutic, or human use is intended or implied.
                Certificates of Analysis (COAs) are available upon request.
            </div>

            <div className="research-layout">
                {/* SIDEBAR */}
                <aside className="research-sidebar">
                    {researchProducts.map(p => (
                        <button
                            key={p.id}
                            type="button"
                            className={`research-menu-btn ${selectedId === p.id ? 'active' : ''}`}
                            onClick={() => setSelectedId(p.id)}
                        >
                            {p.title.split(' 10mg')[0].split(' 20mg')[0].split(' 50mg')[0]}
                        </button>
                    ))}
                </aside>

                {/* CONTENT AREA */}
                <section className="research-content">
                    <div className="research-card">
                        <h2 style={{ fontSize: '28px', color: 'var(--accent)', marginTop: 0, marginBottom: '20px' }}>
                            {selectedProduct.title}
                        </h2>

                        <div style={{ marginBottom: '24px' }}>
                            <strong style={{ color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Chemical Classification
                            </strong>
                            <div style={{ fontSize: '18px', marginTop: '6px', color: '#fff' }}>
                                {selectedProduct.researchInfo.classification}
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <strong style={{ color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Summary
                            </strong>
                            <p style={{ marginTop: '6px', lineHeight: '1.7', fontSize: '15px' }}>
                                {selectedProduct.researchInfo.summary}
                            </p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <strong style={{ color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Research Areas
                            </strong>
                            <ul style={{ marginTop: '8px', paddingLeft: '20px', lineHeight: '1.7', fontSize: '15px' }}>
                                {selectedProduct.researchInfo.areas.map((area, i) => (
                                    <li key={i}>{area}</li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <strong style={{ color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Specifications
                            </strong>
                            <div
                                style={{
                                    marginTop: '10px',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '16px',
                                    background: '#0b1220',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--line)',
                                }}
                            >
                                <div>
                                    <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Form</span>
                                    <div style={{ fontWeight: 500 }}>{selectedProduct.researchInfo.specs.form}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Purity</span>
                                    <div style={{ fontWeight: 500, color: 'var(--ok)' }}>{selectedProduct.researchInfo.specs.purity}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Appearance</span>
                                    <div style={{ fontWeight: 500 }}>{selectedProduct.researchInfo.specs.appearance}</div>
                                </div>
                                {selectedProduct.researchInfo.specs.mw && (
                                    <div>
                                        <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Molecular Weight</span>
                                        <div style={{ fontWeight: 500 }}>{selectedProduct.researchInfo.specs.mw}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ fontSize: '14px', color: 'var(--muted)', borderTop: '1px dashed var(--line)', paddingTop: '16px' }}>
                            <strong>COA:</strong> Available upon request.
                        </div>
                    </div>
                </section>
            </div>

            <footer
                style={{
                    textAlign: 'center',
                    fontSize: '13px',
                    color: 'var(--muted)',
                    marginTop: '60px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--line)',
                }}
            >
                <p>All compounds listed are for laboratory research only.</p>
                <p>Not for human, veterinary, or household use.</p>
                <p>No medical claims are made or implied.</p>
            </footer>
        </main>
    )
}
