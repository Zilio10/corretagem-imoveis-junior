import img3 from "../../assets/images/img3.png"
import "../../styles/pages/About.css"
import { getDataAdm } from '../../services/usuarioService'
import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function About() {

    const [admNumber, setAdmNumber] = useState('5512999999999')

    const bioRef       = useScrollReveal()
    const highlightRef = useScrollReveal()
    const swotRef      = useScrollReveal()
    const ctaRef       = useScrollReveal()

    useEffect(() => {
        async function getAdmNum() {
            try {
                const res = await getDataAdm('admin')
                if (res.data.Sucesso) {
                    setAdmNumber(res.data.Data_Footer.telefone_usuario)
                }
            } catch (err) {
                console.log(err)
            }
        }
        getAdmNum()
    }, [])

    return (
        <main className="about">

            {/* ── HERO — animações de drop mantidas no CSS ── */}
            <section className="about__hero">
                <div className="about__hero-text">
                    <span className="about__eyebrow">Conheça o corretor</span>
                    <h1 className="about__name">
                        Júnior Silva<br />
                    </h1>
                    <p className="about__tagline">
                        Mais de 10 anos conectando famílias ao imóvel dos seus sonhos
                        com transparência, dedicação e resultado.
                    </p>
                </div>
                <div className="about__hero-img-wrap">
                    <img src={img3} alt="Foto do corretor Júnior" className="about__hero-img" />
                    <div className="about__hero-badge">CRECI - 257947</div>
                </div>
            </section>

            {/* ── SOBRE ── */}
            <section className="about__bio reveal-fade-up" ref={bioRef}>
                <div className="about__bio-inner">
                    <h2 className="about__section-title">Quem é o Júnior?</h2>
                    <p>
                        José Antônio da Silva — popularmente conhecido como Júnior — construiu sua
                        carreira no mercado imobiliário com um princípio simples: <strong>ouvir antes
                            de oferecer</strong>. Cada cliente tem uma história, um orçamento e um sonho
                        únicos, e é exatamente isso que guia cada negociação.
                    </p>
                    <p>
                        Especialista em imóveis residenciais e comerciais, atua principalmente na região do Vale do Paraíba, mas também atua em metrópoles, como na Grande São Paulo. Com carteira ativa de imóveis prontos
                        e em lançamento.
                    </p>
                </div>
            </section>

            {/* ── DIFERENCIAIS ── */}
            <section className="about__highlights reveal-fade-up" ref={highlightRef}>
                <div className="about__highlight-card">
                    <span className="about__highlight-num">10+</span>
                    <span className="about__highlight-label">Anos de experiência</span>
                </div>
                <div className="about__highlight-card">
                    <span className="about__highlight-num">100+</span>
                    <span className="about__highlight-label">Imóveis negociados</span>
                </div>
                <div className="about__highlight-card">
                    <span className="about__highlight-num">98%</span>
                    <span className="about__highlight-label">Clientes satisfeitos</span>
                </div>
            </section>

            {/* ── SWOT ── */}
            <section className="about__swot reveal-fade-up" ref={swotRef}>
                <h2 className="about__section-title about__section-title--center">
                    Por que escolher o meu trabalho?
                </h2>
                <p className="about__swot-subtitle">
                    Uma análise honesta de como posso ajudar você
                </p>

                <div className="about__swot-grid">
                    <div className="about__swot-card about__swot-card--S">
                        <div className="about__swot-letter">F</div>
                        <h3>Forças</h3>
                        <ul>
                            <li>Amplo conhecimento do mercado regional</li>
                            <li>Relacionamento direto</li>
                            <li>Agilidade na documentação e processos</li>
                            <li>Carteira diversificada de imóveis</li>
                        </ul>
                    </div>

                    <div className="about__swot-card about__swot-card--O">
                        <div className="about__swot-letter">O</div>
                        <h3>Oportunidades</h3>
                        <ul>
                            <li>Crescimento imobiliário na região do Vale do Paraíba</li>
                            <li>Imóveis em lançamento com ótima localização</li>
                            <li>Alta demanda por imóveis compactos e funcionais</li>
                            <li>Expansão do atendimento digital</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="about__cta reveal-fade-up" ref={ctaRef}>
                <h2>Pronto para encontrar seu imóvel?</h2>
                <p>Entre em contato comigo e dê o primeiro passo.</p>
                <a href={`https://wa.me/${admNumber}`} className="about__cta-btn" target="_blank" rel="noreferrer">
                    <FaWhatsapp /> <span>Falar no WhatsApp</span>
                </a>
            </section>

        </main>
    )
}