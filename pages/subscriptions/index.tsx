import {Panel} from '@bigcommerce/big-design';
import {useProductListAll} from '../../lib/hooks';

const subscriptionsPage = () => {
    const { error, isLoading, list = [], meta = {}, mutateList=[], data } = useProductListAll();

    const clientData = [];

    if(!isLoading) {
        console.log('isLoading data', data)
    }
    
    return (
        <Panel header='Subscriptions page'>
        <div>
            <div className='logo__about_page'>
                <img src='./FOC-logo.png'/>
            </div>
        </div>
        
        </Panel>
    );
};

export default subscriptionsPage;
