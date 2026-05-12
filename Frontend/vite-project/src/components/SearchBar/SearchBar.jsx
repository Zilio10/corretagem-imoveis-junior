import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa'
import "../../styles/components/SearchBar.css"

import { getCidades } from '../../services/imovelService'


export default function SearchBar() {
    const navigate = useNavigate()

    const [cidades, setCidades] = useState([])

    const [aberto, setAberto] = useState(false)

    const [filtros, setFiltros] = useState({
        tipo: '',
        finalidade: '',
        estagio: '',
        cidade: '',
        precoMin: 0,
        precoMax: 50000000,
        qtdQuartos: '',
        qtdVagas: '',
        id: ''
    })

    useEffect(() => {

        async function buscarCidades() {
            try {
                const res = await getCidades()
                setCidades(res.data.Cidades)
            } catch (err) {
                console.log(err)
            }
        }

        buscarCidades()
    }, [])

    const formRef = useRef(null)

    useEffect(() => {

        const handleClickFora = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                setAberto(false)
            }
        }

        if (aberto) document.addEventListener('mousedown', handleClickFora)
        return () => document.removeEventListener('mousedown', handleClickFora)

    }, [aberto])

    const handleChange = (e) => {
        const { name, value } = e.target
        const numericos = ['precoMin', 'precoMax', 'qtdQuartos', 'qtdVagas']

        setFiltros({
            ...filtros,
            [name]: numericos.includes(name) ? Number(value) : value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setAberto(false)

        navigate("/imovelFilter", {
            state: {
                filters: filtros,
                title: 'IMÓVEIS FILTRADOS'
            }
        })
    }

    if (aberto) {
        return (
            <div className="searchbar-container" ref={formRef}>

                <button className="searchbar-trigger" onClick={() => setAberto(!aberto)}>
                    <FaSearch />
                    <span>Pesquisar</span>
                </button>

                <div className="searchbar-overlay" onClick={() => setAberto(false)} />

                <form className="searchbar-form" onSubmit={handleSubmit}>

                    <div className="searchbar-form__header">
                        <span>
                            <FaFilter />
                            Filtrar
                        </span>
                        <button type="button" className="searchbar-close" onClick={() => setAberto(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Tipo do Imóvel</label>
                        <select name="tipo" onChange={handleChange} className='form-inform'>
                            <option value="">Todos</option>
                            <option value="Casa">Casa</option>
                            <option value="Apartamento">Apartamento</option>
                            <option value="Terreno">Terreno</option>
                            <option value="Fazenda">Fazenda</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Finalidade de contrato</label>
                        <select name="finalidade" onChange={handleChange} className='form-inform'>
                            <option value="">Todas</option>
                            <option value="Venda">Venda</option>
                            <option value="Aluguel">Aluguel</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Estágio de construção</label>
                        <select name="estagio" onChange={handleChange} className='form-inform'>
                            <option value="">Todos</option>
                            <option value="Na planta">Na planta</option>
                            <option value="Em execução">Em execução</option>
                            <option value="Pronto">Pronto</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Cidade</label>
                        <select name="cidade" onChange={handleChange} className='form-inform'>
                            <option value="">Todas</option>

                            {cidades.map((cidade, index) => (
                                <option key={index} value={cidade.cidade_imovel}>
                                    {cidade.cidade_imovel}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>ID do imóvel</label>
                        <input type="text" name="id" placeholder="Digite o ID" onChange={handleChange} className='form-inform' />
                    </div>

                    <div className="form-group form-group--full">
                        <label>Preço mínimo: R$ {Number(filtros.precoMin).toLocaleString('pt-BR')}</label>
                        <input type="range" name="precoMin" min={0} max={50000000} step={10000}
                            value={filtros.precoMin} onChange={handleChange} className='form-inform' />
                    </div>

                    <div className="form-group form-group--full">
                        <label>Preço máximo: R$ {Number(filtros.precoMax).toLocaleString('pt-BR')}</label>
                        <input type="range" name="precoMax" min={0} max={50000000} step={10000}
                            value={filtros.precoMax} onChange={handleChange} className='form-inform' />
                    </div>

                    <div className="form-group">
                        <label>Quartos</label>
                        <input type="number" name="qtdQuartos" min={0} placeholder="Qtd. quartos" onChange={handleChange} className='form-inform' />
                    </div>

                    <div className="form-group">
                        <label>Vagas</label>
                        <input type="number" name="qtdVagas" min={0} placeholder="Qtd. vagas" onChange={handleChange} className='form-inform' />
                    </div>

                    <button type="submit" className="searchbar-submit">Buscar</button>

                </form>

            </div>
        )
    }

    return (
        <div className="searchbar-container" ref={formRef}>
            <button className="searchbar-trigger" onClick={() => setAberto(!aberto)}>
                <FaSearch />
                <span>Pesquisar</span>
            </button>
        </div>
    )
}