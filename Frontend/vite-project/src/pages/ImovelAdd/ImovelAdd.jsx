import { useEffect, useState } from "react"
import { isAuthenticated, getToken } from "../../utils/auth"
import { getaddressByCep } from "../../services/cepService"

import '../../styles/pages/ImovelAdd.css'

export default function ImovelAdd() {

    const [userToken, setUserToken] = useState(null)
    const [imagens, setImagens] = useState([])

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

    useEffect(() => {
        if (!isAuthenticated()) return
        const token = getToken()
        setUserToken(token)
    }, [])

    return (
        <div className="imovel-add-page">
            <div className="imovel-add-wrapper">

                {/* HEADER */}
                <div className="imovel-page-header">
                    <h2>Adicionar Imóvel</h2>
                    <p>Preencha as informações do novo imóvel</p>
                </div>

                {/* CARD — INFORMAÇÕES GERAIS */}
                <div className="imovel-card">
                    <p className="imovel-card-title">Informações Gerais</p>

                    <div className="imovel-field">
                        <label>Título</label>
                        <input type="text" placeholder="Ex: Casa com quintal em condomínio fechado" required/>
                    </div>

                    <div className="imovel-field">
                        <label>Descrição</label>
                        <textarea placeholder="Descreva o imóvel com detalhes relevantes..." />
                    </div>

                    <div className="imovel-grid-2">
                        <div className="imovel-field">
                            <label>Preço (R$)</label>
                            <input type="number" step="0.01" min="0" placeholder="0,00" required/>
                        </div>
                        <div className="imovel-field">
                            <label>Tipo</label>
                            <select>
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
                            <select>
                                <option value="">Selecione</option>
                                <option value="Venda">Venda</option>
                                <option value="Aluguel">Aluguel</option>
                                <option value="Permuta">Permuta</option>
                            </select>
                        </div>
                        <div className="imovel-field">
                            <label>Estágio</label>
                            <select>
                                <option value="">Selecione</option>
                                <option value="Concluído">Pronto</option>
                                <option value="Em construção">Em construção</option>
                                <option value="Na planta">Na planta</option>
                            </select>
                        </div>
                        <div className="imovel-field">
                            <label>Status</label>
                            <select>
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
                            <input type="text" placeholder="00000-000" maxLength={9} />
                        </div>
                        <div className="imovel-field">
                            <label>Cidade</label>
                            <input type="text" placeholder="São Paulo" required />
                        </div>
                        <div className="imovel-field">
                            <label>Bairro</label>
                            <input type="text" placeholder="Centro" required />
                        </div>
                        <div className="imovel-field">
                            <label>Número</label>
                            <input type="number" min="0" placeholder="Ex: 123" />
                        </div>
                    </div>
                </div>

                {/* CARD — CARACTERÍSTICAS */}
                <div className="imovel-card">
                    <p className="imovel-card-title">Características</p>

                    <div className="imovel-field">
                        <label>Área</label>
                        <div className="imovel-area-group">
                            <input type="number" min="0" placeholder="Ex: 250" />
                            <select>
                                <option value="m2" title="Metro quadrado">m²</option>
                                <option value="he" title="Hectare">he</option>
                                <option value="alq" title="Alqueire">alq</option>
                            </select>
                        </div>
                    </div>

                    <div className="imovel-grid-4">
                        <div className="imovel-field">
                            <label>Quartos</label>
                            <input type="number" min="0" placeholder="0" required />
                        </div>
                        <div className="imovel-field">
                            <label>Suítes</label>
                            <input type="number" min="0" placeholder="0" required />
                        </div>
                        <div className="imovel-field">
                            <label>Banheiros</label>
                            <input type="number" min="0" placeholder="0" required />
                        </div>
                        <div className="imovel-field">
                            <label>Vagas</label>
                            <input type="number" min="0" placeholder="0" required />
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
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTÕES */}
                <div className="imovel-submit-row">
                    <button className="imovel-btn-cancelar">Cancelar</button>
                    <button className="imovel-btn-cadastrar">Cadastrar Imóvel</button>
                </div>

            </div>
        </div>
    )
}