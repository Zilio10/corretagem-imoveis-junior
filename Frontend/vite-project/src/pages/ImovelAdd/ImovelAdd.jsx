import { FaTimes } from 'react-icons/fa'
import { useEffect, useState } from "react"
import { isAuthenticated, getToken } from "../../utils/auth"
import { getaddressByCep } from "../../services/cepService"

import '../../styles/pages/ImovelAdd.css'

export default function ImovelAdd() {

    const [userToken, setUserToken] = useState(null)

    const [imagens, setImagens] = useState([]) // Imagens
    const [title, setTitle] = useState("") // Título
    const [description, setDescription] = useState("") // Descrição
    const [price, setPrice] = useState("") // Preço
    const [type, setType] = useState("") // Tipo (Casa, Apartamento, Terreno, Fazenda)
    const [finality, setFinality] = useState("") // Finalidade (Venda, Aluguel, Permuta)
    const [stage, setStage] = useState("")  // Estágio (Concluído, Em construção, Na planta)
    const [status, setStatus] = useState("") // Status (Disponível, Vendido, Alugado)
    const [cep, setCep] = useState("") // CEP
    const [city, setCity] = useState("") // Cidade
    const [neighborhood, setNeighborhood] = useState("") // Bairro
    const [street, setStreet] = useState("") // Rua
    const [number, setNumber] = useState("") // Número
    const [adress, setAddress] = useState("") // Endereço completo
    const [area, setArea] = useState("") // Área
    const [areaUnit, setAreaUnit] = useState("m²") // Unidade da área (m², he, alq)
    const [bedrooms, setBedrooms] = useState(0) // Quartos
    const [suites, setSuites] = useState(0) // Suítes
    const [bathrooms, setBathrooms] = useState(0) // Banheiros
    const [parkingSpaces, setParkingSpaces] = useState(0) // Vagas de garagem

    const [imovelData, setImovelData] = useState({}) // Dados do imóvel a serem enviados para a API




    const handleImagemAdd = (e) => {
        const files = Array.from(e.target.files)
        const novas = files.map(file => ({
            file, // file : file (parametro) => Arquivo da imagem
            preview: URL.createObjectURL(file) // => URL temporária para pré-visualização da imagem
        }))
        setImagens(prev => [...prev, ...novas]) // => Adiciona as novas imagens ao estado, mantendo as anteriores (Se não sobreescreveria as anteriores)
    }

    const handleImagemRemover = (index) => {
        setImagens(prev => {
            URL.revokeObjectURL(prev[index].preview)
            return prev.filter((_, i) => i !== index)
        })
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.currentTarget.classList.add("imovel-drag-over")
    }

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove("imovel-drag-over")
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove("imovel-drag-over")
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))
        const novas = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setImagens(prev => [...prev, ...novas])
    }

    const handleCep = async (cep) => {
        try {
            const cepLimpo = cep.replace("-", "")

            const res = await getaddressByCep(cepLimpo)

            if (res.data.erro) {
                return
            }

            setCity(res.data.localidade)
            setNeighborhood(res.data.bairro)
            setStreet(res.data.logradouro)

        } catch (err) {
            console.log(err)
        }
    }

    const handlePrice = (value) => {
        value = value.replace(/\D/g, "")
        value = (Number(value) / 100).toFixed(2)
        value = value.replace(".", ",")
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        setPrice(value)
    }

    const buildAdress = () => {
        if (city && neighborhood && street) {
            if (number) {
                setAddress(`${street}, ${number} - ${neighborhood}, ${city}`)
            } else {
                setAddress(`${street} - ${neighborhood}, ${city} -> (Número não informado) `)
            }
        }
    }

    const handleSubmit = () => {
        setImovelData({
            titulo: title,
            descricao: description,
            preco: price,
            tipo: type,
            finalidade: finality,
            estagio: stage,
            status: status,
            cep: cep,
            cidade: city,
            bairro: neighborhood,
            endereco: adress,
            area: `${area} ${areaUnit}`,
            qtdQuartos: Number(bedrooms),
            qtdSuites: Number(suites),
            qtdBanheiros: Number(bathrooms),
            qtdVagas: Number(parkingSpaces),
            dataCriacao: new Date().toISOString().slice(0, 19).replace("T", " ") //Formata a data no formato "YYYY-MM-DD HH:MM:SS" para compatibilidade com o MySQL
        })

        console.log(imovelData)
    }

    useEffect(() => {
        if (!isAuthenticated()) return
        const token = getToken()
        setUserToken(token)
    }, [])

    useEffect(() => {
        buildAdress()
    }, [city, neighborhood, street, number])

    return (
        <div className="imovel-add-page">
            <div className="imovel-add-wrapper">

                {/* HEADER */}
                <div className="imovel-page-header">
                    <h2>Anunciar Imóvel</h2>
                    <p>Preencha as informações do novo imóvel</p>
                </div>

                {/* CARD — INFORMAÇÕES GERAIS */}
                <div className="imovel-card">
                    <p className="imovel-card-title">Informações Gerais</p>

                    <div className="imovel-field">
                        <label>Título</label>
                        <input type="text" placeholder="Ex: Casa com quintal em condomínio fechado" required value={title} onChange={(e) => { setTitle(e.target.value) }} />
                    </div>

                    <div className="imovel-field">
                        <label>Descrição</label>
                        <textarea placeholder="Descreva o imóvel com detalhes relevantes..." value={description} onChange={(e) => { setDescription(e.target.value) }} />
                    </div>

                    <div className="imovel-grid-2">
                        <div className="imovel-field">
                            <label>Preço (R$)</label>
                            <input type="text" step="0.01" min="0" placeholder="0,00" required value={price} onChange={(e) => { handlePrice(e.target.value) }} />
                        </div>
                        <div className="imovel-field">
                            <label>Tipo</label>
                            <select value={type} onChange={(e) => { setType(e.target.value) }}>
                                <option value="">Selecione</option>
                                <option value="Casa">Casa</option>
                                <option value="Apartamento">Apartamento</option>
                                <option value="Terreno">Terreno</option>
                                <option value="Fazenda">Fazenda</option>
                            </select>
                        </div>
                    </div>

                    <div className="imovel-grid-3">
                        <div className="imovel-field">
                            <label>Finalidade</label>
                            <select value={finality} onChange={(e) => { setFinality(e.target.value) }}>
                                <option value="">Selecione</option>
                                <option value="Venda">Venda</option>
                                <option value="Aluguel">Aluguel</option>
                                <option value="Permuta">Permuta</option>
                            </select>
                        </div>
                        <div className="imovel-field">
                            <label>Estágio</label>
                            <select value={stage} onChange={(e) => { setStage(e.target.value) }}>
                                <option value="">Selecione</option>
                                <option value="Concluído">Pronto</option>
                                <option value="Em construção">Em construção</option>
                                <option value="Na planta">Na planta</option>
                            </select>
                        </div>
                        <div className="imovel-field">
                            <label>Status</label>
                            <select value={status} onChange={(e) => { setStatus(e.target.value) }}>
                                <option value="">Selecione</option>
                                <option value="Disponível">Disponível</option>
                                <option value="Vendido">Vendido</option>
                                <option value="Alugado">Alugado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* CARD — LOCALIZAÇÃO */}
                <div className="imovel-card">
                    <p className="imovel-card-title">Localização</p>

                    <div className="imovel-grid-cep">
                        <div className="imovel-field">
                            <label>CEP</label>
                            <input type="text" placeholder="00000-000" maxLength={9} value={cep} onChange={(e) => {
                                let value = e.target.value
                                value = value.replace(/\D/g, "")
                                value = value.slice(0, 8)
                                if (value.length > 5) { value = value.slice(0, 5) + "-" + value.slice(5) }
                                setCep(value)
                                if (value.length === 9) { handleCep(value) }
                            }} />
                        </div>
                        <div className="imovel-field">
                            <label>Cidade</label>
                            <input type="text" placeholder="Ex: São Paulo" required value={city} onChange={(e) => { setCity(e.target.value) }} />
                        </div>
                        <div className="imovel-field">
                            <label>Bairro</label>
                            <input type="text" placeholder="Ex: Centro" required value={neighborhood} onChange={(e) => { setNeighborhood(e.target.value) }} />
                        </div>
                        <div className="imovel-field imovel-street-field">
                            <label>Logradouro</label>
                            <input type="text" placeholder="Ex: Rua das Flores" required value={street} onChange={(e) => { setStreet(e.target.value) }} />
                        </div>
                        <div className="imovel-field imovel-number-field">
                            <label>Número</label>
                            <input type="number" min="0" placeholder="Ex: 123" value={number} onChange={(e) => { setNumber(e.target.value) }} />
                        </div>
                        <div className="imovel-field imovel-address-field">
                            <label>Endereço completo</label>
                            <input type="text" placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP" value={adress} onChange={(e) => { setAddress(e.target.value) }} />
                        </div>
                    </div>
                </div>

                {/* CARD — CARACTERÍSTICAS */}
                <div className="imovel-card">
                    <p className="imovel-card-title">Características</p>

                    <div className="imovel-field">
                        <label>Área</label>
                        <div className="imovel-area-group">
                            <input type="number" min="0" placeholder="Ex: 250" required value={area} onChange={(e) => { setArea(e.target.value) }} />
                            <select required value={areaUnit} onChange={(e) => { setAreaUnit(e.target.value) }}>
                                <option value="m2" title="Metro quadrado">m²</option>
                                <option value="he" title="Hectare">he</option>
                                <option value="alq" title="Alqueire">alq</option>
                            </select>
                        </div>
                    </div>

                    <div className="imovel-grid-4">
                        <div className="imovel-field">
                            <label>Quartos</label>
                            <input type="number" min="0" placeholder="0" required value={bedrooms} onChange={(e) => { setBedrooms(e.target.value) }} />
                        </div>
                        <div className="imovel-field">
                            <label>Suítes</label>
                            <input type="number" min="0" placeholder="0" required value={suites} onChange={(e) => { setSuites(e.target.value) }} />
                        </div>
                        <div className="imovel-field">
                            <label>Banheiros</label>
                            <input type="number" min="0" placeholder="0" required value={bathrooms} onChange={(e) => { setBathrooms(e.target.value) }} />
                        </div>
                        <div className="imovel-field">
                            <label>Vagas</label>
                            <input type="number" min="0" placeholder="0" required value={parkingSpaces} onChange={(e) => { setParkingSpaces(e.target.value) }} />
                        </div>
                    </div>
                </div>

                {/* CARD — IMAGENS */}
                <div className="imovel-card">
                    <p className="imovel-card-title">Imagens</p>

                    <label
                        className="imovel-upload-dropzone"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagemAdd}
                        />
                        <span className="imovel-upload-icon">🖼️</span>
                        <p>
                            <strong>Clique para selecionar</strong> ou arraste as imagens aqui
                        </p>
                        <span>PNG, JPG, WEBP — até 10 arquivos</span>
                    </label>

                    {imagens.length > 0 && (
                        <div className="imovel-upload-preview">
                            {imagens.map((img, index) => (
                                <div key={index} className="imovel-preview-item">
                                    <img src={img.preview} alt={`Imagem ${index + 1}`} />
                                    <button
                                        className="imovel-preview-remove"
                                        onClick={() => handleImagemRemover(index)}
                                        title="Remover imagem"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTÕES */}
                <div className="imovel-submit-row">
                    <button className="imovel-btn-cancelar" onClick={(e) => {
                        e.preventDefault()
                        window.location.href = "/"
                    }}>Cancelar</button>
                    <button className="imovel-btn-cadastrar" onClick={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}>Cadastrar Imóvel</button>
                </div>

            </div>
        </div>
    )
}