import {Button, Flex, FormGroup, Input, Panel, Form as StyledForm, Message} from '@bigcommerce/big-design';
import {useState, ChangeEvent, useEffect} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import {useProductListAll} from '../../lib/hooks';
import { CSVLink } from 'react-csv';
import { useRouter } from 'next/router';

const importProducts = () => {
    const router = useRouter();
    const [isShownSuccess, setIsShownSuccess] = useState(false);
    const [isShownError, setIsShownError] = useState(false);
    const [formEmail, setFormEmail] = useState({ email: '' });
    const [isShownSuccessSubscribe, setIsShownSuccessSubscribe] = useState(false);
    const [isShownErrorSubscribe, setIsShownErrorSubscribe] = useState(false);
    const [isShownUnsubscribe, setIsShownUnsubscribe] = useState(false);
    const [isLoadingSubscribeShowEmail, setIsLoadingSubscribeShowEmail] = useState(false);
    const [form, setForm] = useState({ email: '', cronTime: '', timezone: '', unsubscribe: false });
    const [formTimeZone, setFormTimeZone] = useState({timezone: 'Africa/Blantyre'});

    const dataImportProduct = [];
    const { error, isLoading, list = [], meta = {}, mutateList=[], data } = useProductListAll();

    const clientData = [];

    if(!isLoading) {
        list.forEach((el)=>{
            dataImportProduct.push(...el.variants)
        })
        clientData.push(process.env.CLIENT_ID);
    }

    //if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: formName, value } = event?.target;
        setFormEmail(prevForm => ({ ...prevForm, [formName]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const onClickBtnSend = (e) => {
        if(formEmail.email === '') {
            return;
        }
        if (e.target.nodeName || e.target.parentElement.nodeName == 'BUTTON') {
            e.target.setAttribute('disabled', 'true');
            e.target.parentElement.setAttribute('disabled', 'true');
        }

        // http://localhost:8080/send
        fetch('https://stock-assistant-friendsofcomme.herokuapp.com/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({dataSCV: dataImportProduct, formEmail: formEmail})
        }).then((response)=> {
            setIsShownSuccess(!isShownSuccess);
        }).catch((error)=> {
            setIsShownError(!isShownError);
        })
        .finally(()=>{
            e.target.removeAttribute('disabled');
            e.target.parentElement.removeAttribute('disabled');
            setTimeout(() => {
                setIsShownSuccess(false);
                setIsShownError(false);
                setFormEmail({ email: '' });
            }, 4000);
        })
    }

    //Subscribe
    const handleChangeForm  = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: formName, value } = event?.target;
        setForm(prevForm => ({ ...prevForm, [formName]: value }));
        setIsLoadingSubscribeShowEmail(false);
    };

    const onSelectFun = (event) => {
        const { name: formName, value } = event?.target;
        setFormTimeZone(prevForm => ({ ...prevForm, [formName]: value }));
    }
    let crontTimeType = '';
    const onClickBtnSubscribe = (e) => {
        if(form.email === '' ) {
            setIsLoadingSubscribeShowEmail(true);
            return;
        }
        if (e.target.nodeName || e.target.parentElement.nodeName == 'BUTTON') {
            e.target.setAttribute('disabled', 'true');
            e.target.parentElement.setAttribute('disabled', 'true');
        }
       
        const cronArr = $('#example1-val')[0].textContent.split(' ');
        if(cronArr[2]=='*' && cronArr[3]=='*' && cronArr[4]=='*') {
            crontTimeType = 'day';
        }
        if(cronArr[2]=='*' && cronArr[3]=='*' && cronArr[4]!=='*') {
            crontTimeType = 'week';
        }
        if(cronArr[3]=='*' && cronArr[4]=='*' && cronArr[2]!=='*') {
            crontTimeType = 'month';
        }

        //http://localhost:8080/subscribe
        fetch('https://stock-assistant-friendsofcomme.herokuapp.com/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                form: form,
                timeZone: formTimeZone.timezone,
                cronTime: $('#example1-val')[0].textContent,
                crontTimeType: crontTimeType,
                accessToken: data?.accessToken,
                storeHash: data?.storeHash,
                clientID: process.env.CLIENT_PUBLIC_ID
            })
        })
            .then((data) => {
                setIsShownSuccessSubscribe(!isShownSuccessSubscribe);
            }).catch((error)=> {
                setIsShownErrorSubscribe(!isShownErrorSubscribe);
            })
            .finally(()=>{
                e.target.removeAttribute('disabled');
                e.target.parentElement.removeAttribute('disabled');
                setIsLoadingSubscribeShowEmail(false);
                setTimeout(() => {
                    router.push('/subscriptions');
                    setIsShownSuccessSubscribe(false);
                    setIsShownErrorSubscribe(false);
                    setForm({ email:'', cronTime: '', timezone: '', unsubscribe: false });
                }, 4000);
            })
    }
    useEffect(() => {

        const aScript = document.createElement('script');
        aScript.type = 'text/javascript';
        aScript.src = "./jquery.min.js";

        document.head.appendChild(aScript);
        aScript.onload = () => {
            console.log('script load jquery.js');
            const bScript = document.createElement('script');
            bScript.type = 'text/javascript';
            bScript.src = "./jquery-cron-min.js";

            /**/
            const dScript = document.createElement('script');
            dScript.type = 'text/javascript';
            dScript.src = "./timezones.full.js";

            document.head.appendChild(dScript);
            dScript.onload = () => {
                console.log('script load timezones.full.js');
                const eScript = document.createElement('script');
                eScript.type = 'text/javascript';
                eScript.src = "./timezone-custom.js";

                document.head.appendChild(eScript);
                eScript.onload = () => {
                    console.log('script load timezone-custom.js')
                };
            };
            document.head.appendChild(bScript);
            bScript.onload = () => {
                console.log('script load jquery-cron-min.js');
                const cScript = document.createElement('script');
                cScript.type = 'text/javascript';
                cScript.src = "./cron.js";

                document.head.appendChild(cScript);
                cScript.onload = () => {
                    $('#example1-val').hide();
                    console.log('script load cron.js');
                };
            };
        };
    }, [])
    //stripe_load();

    return (
        <>
            <div className='block-dashboard'>
                Reports
            </div>
            <div className='inventory-row'>
                <Panel header="Report">
                <table className='inventory-report-table'>
                    <tr>
                        <th>NAME</th>
                        <th>Download</th>
                    </tr>
                    <tr>
                        <td>
                            <CSVLink
                                data={dataImportProduct}
                                className="btn btn-primary"
                                filename={"BigCommerce-import-products.csv"}
                            >
                                Current Inventory report
                            </CSVLink>
                        </td>
                        <td>
                            <span>
                                <CSVLink
                                        data={dataImportProduct}
                                        className="btn btn-primary"
                                        filename={"BigCommerce-inventory-report-products.csv"}
                                    >
                                    csv
                                </CSVLink>
                            </span>
                        </td>
                    </tr>
                </table>
                    
                </Panel>
                <StyledForm onSubmit={handleSubmit}>
                    <Panel header="Email Reports">
                        <FormGroup>
                            <Input
                                label="Email*"
                                name="email"
                                placeholder='mail@simple.com'
                                required
                                value={formEmail.email}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        {isShownError &&
                            <Message
                                type="error"
                                messages={[{ text: 'An error occurred, the email was not sent. Please repeat again ' }]}
                                marginVertical="medium"
                            />
                        }
                        {isShownSuccess &&
                            <Message
                                type="success"
                                messages={[{ text: 'Email sent successfully ' }]}
                                marginVertical="medium"
                            />
                        }
                        <Flex justifyContent="flex-end">
                            <Button
                                type="submit"
                                onClick={onClickBtnSend}
                            >
                                Send Email
                            </Button>
                        </Flex>
                    </Panel>
                </StyledForm>
            </div>
            <div className='inventory-row'>    
                <Panel header="Report Subscriptions">
                    <FormGroup>
                        <Input
                            label="Email*"
                            name="email"
                            placeholder='mail@simple.com'
                            required
                            value={form.email}
                            onChange={handleChangeForm}
                        />
                    </FormGroup>
                    {isShownSuccessSubscribe &&
                        <Message
                            type="success"
                            messages={[{ text: 'Subscription Created ' }]}
                            marginVertical="medium"
                        />
                    }
                    {isShownErrorSubscribe &&
                        <Message
                            type="error"
                            messages={[{ text: 'An error occurred, the email was not sent. Please repeat again ' }]}
                            marginVertical="medium"
                        />
                    }
                    {isLoadingSubscribeShowEmail &&
                        <Message
                            type="warning"
                            messages={[{ text: 'Email field is empty, please enter your email ' }]}
                            marginVertical="medium"
                        />}
                        <p>Frequency</p>
                        <FormGroup>
                            <p>
                                <div id='example1-val'></div>
                                <div 
                                    id='my-custom-cron' 
                                    style={{ marginBottom: '10px' }} 
                                    className='cron-style'
                                >
                                    Submit a report:&nbsp;<i className="fa fa-clock-o" aria-hidden="true"></i>
                                </div>
                                <select
                                    name="timezone"
                                    className="form-control"
                                    onChange={onSelectFun}
                                />
                            </p>
                        </FormGroup>
                    <FormGroup>
                        <Flex justifyContent="flex-end">
                            <Button
                                type="submit"
                                onClick={onClickBtnSubscribe}
                            >
                                Subscribe
                            </Button>
                        </Flex>
                    </FormGroup>
                    <Button type="button" onClick={() => router.push('/subscriptions')}>
                        Subscribe list
                    </Button>
                </Panel>
            </div>
        </>
    );
};

export default importProducts;