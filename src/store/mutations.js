
export const state = {
    modal: { visible: false }
}

export const mutations = {
    showModal: () => {
        state.modal.visible = true;
    },
    closeModal: () => {
        state.modal.visible = false;
    }
}