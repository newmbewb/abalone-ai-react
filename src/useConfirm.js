const useConfirm = (message = "", onConfirm, onCancel) => {
    if (window.confirm(message)) {
        onConfirm();
    } else {
        onCancel();
    }
};
   
export default useConfirm;