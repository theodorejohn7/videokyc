 import { Dialog } from "primereact/dialog";
import styles from "../styles/InputForm.module.css";

const ImageModal = (props) => {

    const { visible, setVisible, header, content } = props;
 
    return <Dialog header={header} visible={visible}
        className={styles.dialogBox}
        closable={header}
        showHeader={header}
        style={{ width: '50vw', height:'80vh'  }} onHide={() => setVisible(false)}>
        {content}
    </Dialog>
}
// 


export default ImageModal;