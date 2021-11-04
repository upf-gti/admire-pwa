import { useHistory } from 'react-router-dom'

import MD from 'utils/md';
import Modal from 'partials/modal'
import Layout from 'partials/layout'


export default ()=>{
    const history = useHistory();

    return <Layout className="user-verified">
        <Modal size="md" show={true} 
            title={<h2 className="user-select-none">User verified!🎉🎉</h2>}
            button_tittle="Understood"
            callback={ ()=>{ history.push('/') } }
        >
            <MD className="user-select-none">{`Account verified successfully in the system. You can now login on the application.`}</MD>
        </Modal> 
    </Layout>
}