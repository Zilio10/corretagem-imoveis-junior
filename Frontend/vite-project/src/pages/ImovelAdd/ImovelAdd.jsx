import { FaTimes } from 'react-icons/fa'
import { useEffect, useState } from "react"
import { isAuthenticated, getToken } from "../../utils/auth"
import { getaddressByCep } from "../../services/cepService"
import { createImovel } from "../../services/imovelService"

import Swal from 'sweetalert2'

import '../../styles/pages/ImovelAdd.css'

export default function ImovelAdd() {

    const [userToken, setUserToken] = useState(null)

    const [imagens, setImagens] = useState([]) // Imagens
    const [dragIndex, setDragIndex] = useState(null)
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

    const [showLogoutModal, setShowLogoutModal] = useState(false)


    const swalStyled = Swal.mixin({
        customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            htmlContainer: 'swal-text',
            confirmButton: 'swal-btn-confirm',
        },
        buttonsStyling: false,
    })

    const toaster = (success, message = '') => {
        if (success) {
            swalStyled.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Dados atualizados com sucesso!',
            })
        } else {
            swalStyled.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao atualizar dados: ' + message,
            })
        }
    }

    const handleImagemAdd = (e) => {
        const files = Array.from(e.target.files)
        const novas = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setImagens(prev => [...prev, ...novas])
    }

    const handleImagemRemover = (index) => {
        setImagens(prev => {
            URL.revokeObjectURL(prev[index].preview)
            return prev.filter((_, i) => i !== index)
        })
    }

    const handleDragStartImage = (index) => {
        setDragIndex(index)
    }

    const handleDropImage = (dropIndex) => {
        if (dragIndex === null || dragIndex === dropIndex) return

        const updatedImages = [...imagens]

        const draggedItem = updatedImages[dragIndex]

        updatedImages.splice(dragIndex, 1)

        updatedImages.splice(dropIndex, 0, draggedItem)

        setImagens(updatedImages)
        setDragIndex(null)
    }

    const handleDragEndImage = () => {
        setDragIndex(null)
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

    const handleSubmit = async () => {
        const camposObrigatorios = [
            { valor: title, nome: "Título" },
            { valor: price, nome: "Preço" },
            { valor: type, nome: "Tipo" },
            { valor: finality, nome: "Finalidade" },
            { valor: stage, nome: "Estágio" },
            { valor: status, nome: "Status" },
            { valor: city, nome: "Cidade" },
            { valor: neighborhood, nome: "Bairro" },
            { valor: street, nome: "Logradouro" },
            { valor: area, nome: "Área" },
        ]

        const vazio = camposObrigatorios.find(c => !c.valor || c.valor.toString().trim() === "")

        if (vazio) {
            swalStyled.fire({
                icon: 'warning',
                title: 'Campo obrigatório',
                text: `O campo "${vazio.nome}" é obrigatório.`,
            })
            return
        }

        if (imagens.length === 0) {
            swalStyled.fire({
                icon: 'warning',
                title: 'Imagens obrigatórias',
                text: 'Adicione pelo menos uma imagem.',
            })
            return
        }

        const formData = new FormData()

        formData.append("titulo", title)
        formData.append("descricao", description)
        formData.append("preco", price)
        formData.append("tipo", type)
        formData.append("finalidade", finality)
        formData.append("estagio", stage)
        formData.append("status", status)
        formData.append("cep", cep)
        formData.append("cidade", city)
        formData.append("bairro", neighborhood)
        formData.append("endereco", adress)
        formData.append("area", `${area} ${areaUnit}`)
        formData.append("qtdQuartos", Number(bedrooms))
        formData.append("qtdSuites", Number(suites))
        formData.append("qtdBanheiros", Number(bathrooms))
        formData.append("qtdVagas", Number(parkingSpaces))
        formData.append("dataCriacao", new Date().toISOString().slice(0, 19).replace("T", " "))

        imagens.forEach(img => formData.append("imagens", img.file))

        try {
            const res = await createImovel(formData, userToken)
            if (res.data.Sucesso) {
                toaster(true)
                setTimeout(() => window.location.reload(), 1500)
            } else {
                toaster(false, res.data.Erro)
            }
        } catch (err) {
            console.error("Erro ao cadastrar:", err)
            toaster(false, err.response?.data?.Erro || err.message)
        }
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
                        <label>Título <span className="imovel-required">obrigatório</span></label>
                        <input type="text" placeholder="Ex: Casa com quintal em condomínio fechado" required value={title} onChange={(e) => { setTitle(e.target.value) }} />
                    </div>

                    <div className="imovel-field">
                        <label>Descrição</label>
                        <textarea placeholder="Descreva o imóvel com detalhes relevantes..." value={description} onChange={(e) => { setDescription(e.target.value) }} />
                    </div>

                    <div className="imovel-grid-2">
                        <div className="imovel-field">
                            <label>Preço (R$) <span className="imovel-required">obrigatório</span></label>
                            <input type="text" step="0.01" min="0" placeholder="0,00" required value={price} onChange={(e) => { handlePrice(e.target.value) }} />
                        </div>
                        <div className="imovel-field">
                            <label>Tipo <span className="imovel-required">obrigatório</span></label>
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
                            <label>Finalidade <span className="imovel-required">obrigatório</span></label>
                            <select value={finality} onChange={(e) => { setFinality(e.target.value) }}>
                                <option value="">Selecione</option>
                                <option value="Venda">Venda</option>
                                <option value="Aluguel">Aluguel</option>
                                <option value="Permuta">Permuta</option>
                            </select>
                        </div>
                        <div className="imovel-field">
                            <label>Estágio <span className="imovel-required">obrigatório</span></label>
                            <select value={stage} onChange={(e) => { setStage(e.target.value) }}>
                                <option value="">Selecione</option>
                                <option value="Concluído">Pronto</option>
                                <option value="Em construção">Em construção</option>
                                <option value="Na planta">Na planta</option>
                            </select>
                        </div>
                        <div className="imovel-field">
                            <label>Status <span className="imovel-required">obrigatório</span></label>
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
                            <label>Cidade <span className="imovel-required">obrigatório</span></label>
                            <input type="text" placeholder="Ex: São Paulo" required value={city} onChange={(e) => { setCity(e.target.value) }} />
                        </div>
                        <div className="imovel-field">
                            <label>Bairro <span className="imovel-required">obrigatório</span></label>
                            <input type="text" placeholder="Ex: Centro" required value={neighborhood} onChange={(e) => { setNeighborhood(e.target.value) }} />
                        </div>
                        <div className="imovel-field imovel-street-field">
                            <label>Logradouro <span className="imovel-required">obrigatório</span></label>
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
                        <label>Área <span className="imovel-required">obrigatório</span></label>
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
                                <div
                                    key={index}
                                    className={`imovel-preview-item ${dragIndex === index ? 'dragging' : ''}`}
                                    draggable
                                    onDragStart={() => handleDragStartImage(index)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDropImage(index)}
                                    onDragEnd={handleDragEndImage}
                                >
                                    <img src={img.preview} alt={`Imagem ${index + 1}`} />

                                    <button
                                        className="imovel-preview-remove"
                                        onClick={() => handleImagemRemover(index)}
                                        title="Remover imagem"
                                    >
                                        <FaTimes />
                                    </button>

                                    <span className="imovel-image-order">
                                        {index + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                 {/* BOTÕES */}
                <div className="imovel-submit-row">
                    <button className="imovel-btn-cadastrar" onClick={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}>Criar Anúncio</button>
                    <button className="imovel-btn-cancelar" onClick={(e) => {
                        e.preventDefault()
                        setShowLogoutModal(true)
                    }}>Cancelar</button>
                </div>

                {showLogoutModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <p>Tem certeza que deseja sair?</p>
                            <p>As alterações realizadas serão perdidas.</p>
                            <div className="modal-actions">
                                <button onClick={() => setShowLogoutModal(false)}>Cancelar</button>
                                <button onClick={() => { window.location.href = "/"; setShowLogoutModal(false); }}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}