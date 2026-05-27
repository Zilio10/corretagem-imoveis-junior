import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'

import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy,
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'
import { FaTrash } from 'react-icons/fa'

import { deleteImage, updateImage, uploadImage } from '../../services/imagemService'
import { getToken } from '../../utils/auth'

import '../../styles/components/ImageUpdater.css'

// ── Modal ───────────────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel }) {
    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
                padding: '16px',
                boxSizing: 'border-box',
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    padding: '28px 24px',
                    width: '100%',
                    maxWidth: '360px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxSizing: 'border-box',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#1a2332' }}>
                    Remover imagem?
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#8a95a3' }}>
                    Esta ação não poderá ser desfeita.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: '#f0f2f5',
                            color: '#1a2332',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'rgba(192, 57, 43, 0.85)',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

// ── Item individual ─────────────────────────────────────────────────────────
function SortableImage({ item, onOpenDeleteModal }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id_imagem })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : 'auto',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`iu-item ${isDragging ? 'iu-item--dragging' : ''}`}
        >
            <div className="iu-item__drag" {...attributes} {...listeners}>
                <img
                    src={item.endereco_imagem}
                    alt={`Imagem ${item.posicao_imagem}`}
                    className="iu-item__img"
                    draggable={false}
                />
                {item.posicao_imagem === 1 && (
                    <span className="iu-item__badge">Capa</span>
                )}
            </div>

            <button
                className="iu-item__delete"
                onClick={() => onOpenDeleteModal(item)}
                title="Remover imagem"
            >
                <FaTrash />
            </button>
        </div>
    )
}

// ── Componente principal ────────────────────────────────────────────────────
export default function ImageUpdater({ images, idImovel }) {
    const [items, setItems] = useState(images ?? [])
    const [loading, setLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const token = getToken()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 5 },
        })
    )

    const openDeleteModal = (item) => {
        setSelectedItem(item)
        setShowDeleteModal(true)
    }

    const closeDeleteModal = () => {
        setSelectedItem(null)
        setShowDeleteModal(false)
    }

    // ── Drag and drop ───────────────────────────────────────────────────────
    const handleDragEnd = async ({ active, over }) => {
        if (!over || active.id === over.id) return

        const oldIndex = items.findIndex(i => i.id_imagem === active.id)
        const newIndex = items.findIndex(i => i.id_imagem === over.id)

        const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
            ...item,
            posicao_imagem: idx + 1,
        }))

        setItems(reordered)

        try {
            setLoading(true)
            const updates = reordered
                .filter((item, idx) => items[idx]?.id_imagem !== item.id_imagem)
                .map(item =>
                    updateImage(item.id_imagem, {
                        endereco: item.endereco_imagem,
                        posicao: item.posicao_imagem,
                        idImovel: item.id_imovel_imagem,
                    }, token)
                )
            await Promise.all(updates)
        } catch (err) {
            console.error('Erro ao salvar posições:', err)
        } finally {
            setLoading(false)
        }
    }

    // ── Deletar imagem ──────────────────────────────────────────────────────
    const handleDelete = async (item) => {
        try {
            setLoading(true)
            await deleteImage(item.id_imagem, token)

            const updated = items
                .filter(i => i.id_imagem !== item.id_imagem)
                .map((i, idx) => ({ ...i, posicao_imagem: idx + 1 }))

            setItems(updated)

            await Promise.all(
                updated.map(i =>
                    updateImage(i.id_imagem, {
                        endereco: i.endereco_imagem,
                        posicao: i.posicao_imagem,
                        idImovel: i.id_imovel_imagem,
                    }, token)
                )
            )
        } catch (err) {
            console.error('Erro ao deletar imagem:', err)
        } finally {
            setLoading(false)
            closeDeleteModal()
        }
    }

    // ── Adicionar imagem ────────────────────────────────────────────────────
    const handleAdd = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setLoading(true)

            const imovelId = idImovel ?? items[0]?.id_imovel_imagem
            const posicao = items.length + 1

            const formData = new FormData()
            formData.append('imagem', file)
            formData.append('idImovel', imovelId)
            formData.append('posicao', posicao)

            const res = await uploadImage(formData, token)

            if (res.data.Sucesso) {
                setItems(prev => [...prev, {
                    id_imagem: res.data.Id_Imagem,
                    endereco_imagem: res.data.Endereco,
                    posicao_imagem: posicao,
                    id_imovel_imagem: imovelId,
                }])
            }
        } catch (err) {
            console.error('Erro ao adicionar imagem:', err)
        } finally {
            setLoading(false)
            e.target.value = ''
        }
    }

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="iu-wrapper">

            {loading && (
                <div className="iu-loading">Salvando...</div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id_imagem)}
                    strategy={rectSortingStrategy}
                >
                    <div className="iu-grid">
                        {items.map(item => (
                            <SortableImage
                                key={item.id_imagem}
                                item={item}
                                onOpenDeleteModal={openDeleteModal}
                            />
                        ))}

                        <label className="iu-item iu-item--add" title="Adicionar imagem">
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAdd}
                            />
                            <span className="iu-add-icon">+</span>
                        </label>
                    </div>
                </SortableContext>
            </DndContext>

            {showDeleteModal && selectedItem && (
                <DeleteModal
                    onConfirm={() => handleDelete(selectedItem)}
                    onCancel={closeDeleteModal}
                />
            )}

        </div>
    )
}