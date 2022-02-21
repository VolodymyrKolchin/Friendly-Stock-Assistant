import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function importProducts(req: NextApiRequest, res: NextApiResponse) {
    try {

        const bigcommerce = bigcommerceClient(accessToken, storeHash);
        const { accessToken, storeHash } = await getSession(req);
        const dataEmail = [];
        fetch('https://stock-assistant-friendsofcomme.herokuapp.com/email-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                //storeHash: data?.storeHash,
                storeHash: `${storeHash}`
            })
        })
        .then(response => response.json())
        .then(data => {
            data.message[0].forEach((el)=>{
                dataEmail.push(el.email);
            })
            console.log('1!dataEmail', dataEmail);
        })
        console.log('dataEmail2', dataEmail);

        const { data } = await bigcommerce.get('/catalog/products?include=variants');
        res.status(201).json({data, accessToken: accessToken, storeHash: storeHash, dataEmail:dataEmail});
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
