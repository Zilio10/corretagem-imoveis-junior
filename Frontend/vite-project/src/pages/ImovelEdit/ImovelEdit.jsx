import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, getToken } from "../../utils/auth";
import { getAllFiltered } from "../../services/imovelService";
import { getByImovel } from "../../services/imagemService";

import "../../styles/pages/ImovelEdit.css"

import ImageUpdater from "../../components/ImageUpdater/ImageUptader";

import { FaTimes, FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'

export default function ImovelEdit() {
    const { idImovel } = useParams()
    const [userToken, setUserToken] = useState(null)

    const [imovelData, setImovelData] = useState(null)
    const [images, setImages] = useState(null)

    const [title, setTitle] = useState("") // Título
    const [description, setDescription] = useState("") // Descrição
    const [price, setPrice] = useState("") // Preço
    const [type, setType] = useState("") // Tipo (Casa, Apartamento, Terreno, Fazenda)
    const [finality, setFinality] = useState("") // Finalidade (Venda, Aluguel, Permuta)
    const [stage, setStage] = useState("")  // Estágio (Concluído, Em construção, Na planta)
    const [status, setStatus] = useState("") // Status (Disponível, Vendido, Alugado)
    const [city, setCity] = useState("") // Cidade
    const [neighborhood, setNeighborhood] = useState("") // Bairro
    const [adress, setAddress] = useState("") // Endereço completo
    const [area, setArea] = useState("") // Área
    const [areaUnit, setAreaUnit] = useState("m²") // Unidade da área (m², he, alq)
    const [bedrooms, setBedrooms] = useState(0) // Quartos
    const [suites, setSuites] = useState(0) // Suítes
    const [bathrooms, setBathrooms] = useState(0) // Banheiros
    const [parkingSpaces, setParkingSpaces] = useState(0) // Vagas de garagem

    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)


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

    function parseArea(areaStr) {
        if (!areaStr) return { value: "", unit: "m²" }
        const match = areaStr.match(/^([\d.,]+)\s*(.+)$/)
        if (match) return { value: match[1], unit: match[2].trim() }
        return { value: areaStr, unit: "m²" }
    }

    function formatPrice(raw) {
        const numStr = String(raw).replace(/[^\d]/g, "")
        const number = Number(numStr) / 100
        return number.toFixed(2)
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    async function handleSubmit() {
        alert("Enviou")
    }

    async function handleDelete() {
        alert("Deletou")
    }


    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [idImovel])

    useEffect(() => {
        if (!isAuthenticated()) return
        const token = getToken()
        setUserToken(token)
    }, [])

    useEffect(() => {

        async function getImovelData(id) {
            try {
                const res = await getAllFiltered({ id })
                console.log(res.data.Imoveis)
                setImovelData(res.data.Imoveis[0])
            } catch (err) {
                console.error(err)
            }
        }

        async function getImovelImages(id) {
            try {
                const res = await getByImovel(id)
                setImages(res.data.Imagens)
            } catch (err) {
                console.error(err)
            }
        }

        getImovelData(idImovel)
        getImovelImages(idImovel)

    }, [idImovel])

    useEffect(() => {
        if (!imovelData) return

        setTitle(imovelData.titulo_imovel || "")
        setDescription(imovelData.descricao_imovel || "")
        setPrice(formatPrice(imovelData.preco_imovel) || "")
        setType(imovelData.tipo_imovel || "")
        setFinality(imovelData.finalidade_imovel || "")
        setStage(imovelData.estagio_imovel || "")
        setStatus(imovelData.status_imovel || "")
        setCity(imovelData.cidade_imovel || "")
        setNeighborhood(imovelData.bairro_imovel || "")
        setAddress(imovelData.endereco_imovel || "")
        setBedrooms(imovelData.qtd_quartos_imovel || 0)
        setSuites(imovelData.qtd_suites_imovel || 0)
        setBathrooms(imovelData.qtd_banheiros_imovel || 0)
        setParkingSpaces(imovelData.qtd_vagas_imovel || 0)
        setArea(parseArea(imovelData.area_imovel).value)
        setAreaUnit(parseArea(imovelData.area_imovel).unit)

    }, [imovelData])

    return (

        <div className="imovel-edit-page">
            <div className="imovel-edit-wrapper">

                {/* HEADER */}
                <div className="imovel-page-header">
                    <div className="imovel-header-badge">
                        <span>ID #{imovelData?.id_imovel}</span>
                        <span className="imovel-header-dot" />
                        <span>
                            Anunciado em{" "}
                            {imovelData?.data_criacao_imovel
                                ? new Date(imovelData.data_criacao_imovel).toLocaleDateString("pt-BR")
                                : "—"}
                        </span>
                    </div>
                    <h2>Editar Imóvel</h2>
                    <p>Atualize as informações do imóvel abaixo</p>
                </div>

                {/* CARD — IMAGENS */}
                <div className="imovel-card">
                    <p className="imovel-card-title">Imagens</p>

                    <div className="imovel-imageupdater-container">
                        {images && <ImageUpdater images={images} />}
                    </div>
                </div>

                {/* CARD — INFORMAÇÕES GERAIS */}
                <div className="imovel-card">
                    <p className="imovel-card-title">Informações Gerais</p>

                    <div className="imovel-field">
                        <label>Título <span className="imovel-required">obrigatório</span></label>
                        <input
                            type="text"
                            placeholder="Ex: Casa com quintal em condomínio fechado"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="imovel-field">
                        <label>Descrição</label>
                        <textarea
                            placeholder="Descreva o imóvel com detalhes relevantes..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="imovel-grid-2">
                        <div className="imovel-field">
                            <label>Preço (R$) <span className="imovel-required">obrigatório</span></label>
                            <input
                                type="text"
                                placeholder="0,00"
                                value={price}
                                onChange={(e) => handlePrice(e.target.value)}
                            />
                        </div>
                        <div className="imovel-field">
                            <label>Tipo <span className="imovel-required">obrigatório</span></label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
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
                            <select value={finality} onChange={(e) => setFinality(e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="Venda">Venda</option>
                                <option value="Aluguel">Aluguel</option>
                                <option value="Permuta">Permuta</option>
                            </select>
                        </div>
                        <div className="imovel-field">
                            <label>Estágio <span className="imovel-required">obrigatório</span></label>
                            <select value={stage} onChange={(e) => setStage(e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="Concluído">Pronto</option>
                                <option value="Em construção">Em construção</option>
                                <option value="Na planta">Na planta</option>
                            </select>
                        </div>
                        <div className="imovel-field">
                            <label>Status <span className="imovel-required">obrigatório</span></label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
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

                    <div className="imovel-grid-2">
                        <div className="imovel-field">
                            <label>Cidade <span className="imovel-required">obrigatório</span></label>
                            <input
                                type="text"
                                placeholder="Ex: São Paulo"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div className="imovel-field">
                            <label>Bairro <span className="imovel-required">obrigatório</span></label>
                            <input
                                type="text"
                                placeholder="Ex: Centro"
                                value={neighborhood}
                                onChange={(e) => setNeighborhood(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="imovel-field">
                        <label>Endereço <span className="imovel-required">obrigatório</span></label>
                        <input
                            type="text"
                            placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo"
                            value={adress}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                </div>

                {/* CARD — CARACTERÍSTICAS */}
                <div className="imovel-card">
                    <p className="imovel-card-title">Características</p>

                    <div className="imovel-field">
                        <label>Área <span className="imovel-required">obrigatório</span></label>
                        <div className="imovel-area-group">
                            <input
                                type="number"
                                min="0"
                                placeholder="Ex: 250"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                            />
                            <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
                                <option value="m²">m²</option>
                                <option value="he">he</option>
                                <option value="alq">alq</option>
                            </select>
                        </div>
                    </div>

                    <div className="imovel-grid-4">
                        <div className="imovel-field">
                            <label>Quartos</label>
                            <input type="number" min="0" placeholder="0" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                        </div>
                        <div className="imovel-field">
                            <label>Suítes</label>
                            <input type="number" min="0" placeholder="0" value={suites} onChange={(e) => setSuites(e.target.value)} />
                        </div>
                        <div className="imovel-field">
                            <label>Banheiros</label>
                            <input type="number" min="0" placeholder="0" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
                        </div>
                        <div className="imovel-field">
                            <label>Vagas</label>
                            <input type="number" min="0" placeholder="0" value={parkingSpaces} onChange={(e) => setParkingSpaces(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* BOTÕES */}
                <div className="imovel-submit-row">
                    <button className="imovel-btn-cancelar" onClick={(e) => { e.preventDefault(); setShowCancelModal(true) }}>
                        Cancelar
                    </button>

                    <button className="imovel-btn-salvar" onClick={(e) => { e.preventDefault(); handleSubmit() }}>
                        Salvar Alterações
                    </button>
                </div>

                {showCancelModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <p>Tem certeza que deseja cancelar?</p>
                            <p>As alterações realizadas serão perdidas.</p>
                            <div className="modal-actions">
                                <button onClick={() => setShowCancelModal(false)}>Voltar</button>
                                <button onClick={() => { window.location.href = "/"; setShowCancelModal(false) }}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CARD — ZONA DE PERIGO */}
                <div className="imovel-danger-zone">

                    <div className="imovel-danger-content">
                        <div>
                            <h3>Excluir anúncio <FaTrash /></h3>
                            <p>
                                Esta ação é permanente e removerá o anúncio do imóvel e
                                suas imagens do sistema!
                            </p>
                        </div>

                        <button className="imovel-btn-delete" onClick={() => setShowDeleteModal(true)}>
                            Excluir anúncio
                        </button>
                    </div>
                </div>

                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <p>Tem certeza que deseja excluir este anúncio?</p>
                            <p>Esta ação não poderá ser desfeita.</p>
                            <div className="modal-actions">
                                <button onClick={() => setShowDeleteModal(false)}>
                                    Cancelar
                                </button>

                                <button className="modal-delete-btn" onClick={() => { handleDelete(); setShowDeleteModal(false) }} >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>

    )
}
