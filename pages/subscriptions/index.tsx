import {Panel, Button, Message, FormGroup, Input, Flex} from '@bigcommerce/big-design';
import {useProductListAll} from '../../lib/hooks';
import {useEffect, useState, ChangeEvent} from 'react';
import cronstrue from 'cronstrue';

const subscriptionsPage = () => {
    const [isShownUnsubscribe, setIsShownUnsubscribe] = useState(false);
    const { error, isLoading, list = [],data } = useProductListAll();

    const [isShownSuccessSubscribe, setIsShownSuccessSubscribe] = useState(false);
    const [isShownErrorSubscribe, setIsShownErrorSubscribe] = useState(false);
    const [isLoadingSubscribeShowEmail, setIsLoadingSubscribeShowEmail] = useState(false);
    const [form, setForm] = useState({ email: '', cronTime: '', timezone: '', unsubscribe: false });
    const [formTimeZone, setFormTimeZone] = useState({timezone: 'Africa/Blantyre'});

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

    const deleteEmailItem = (e) => {
        let ID = '';
        if (e.target.nodeName == 'BUTTON') {
            ID = e.target.id;
        }
        if (e.target.parentElement.nodeName == 'BUTTON') {
            ID = e.target.parentElement.id;
        }
        if (e.target.parentElement.parentElement.nodeName == 'LI') {
            e.target.parentElement.parentElement.classList.add("hide");
            e.target.parentElement.parentElement.querySelectorAll("div.hide-message")[0].classList.add("visible-message");
        }
        if (e.target.nodeName || e.target.parentElement.nodeName == 'BUTTON') {
            e.target.setAttribute('disabled', 'true');
            e.target.parentElement.setAttribute('disabled', 'true');
        }
        setIsShownUnsubscribe(true);
        fetch(`https://stock-assistant-friendsofcomme.herokuapp.com/delete/${ID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res)=>{console.log('res', res)})
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
        console.log('crontTimeType', crontTimeType);

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
                console.log('response', data);
                setIsShownSuccessSubscribe(!isShownSuccessSubscribe);
            }).catch((error)=> {
                console.log('error', error);
                setIsShownErrorSubscribe(!isShownErrorSubscribe);
            })
            .finally(()=>{
                e.target.removeAttribute('disabled');
                e.target.parentElement.removeAttribute('disabled');
                setIsLoadingSubscribeShowEmail(false);
                setTimeout(() => {
                    //router.push('/subscriptions');
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
                    if($('.month-li').length == 0) {
                        document.getElementById('month').classList.add("hide-block");
                        console.log('month.length == 0');
                    }
                    if($('.day-li').length == 0) {
                        document.getElementById('day').classList.add("hide-block");
                        console.log('day.length == 0');
                    }
                    if($('.week-li').length == 0) {
                        document.getElementById('week').classList.add("hide-block");
                        console.log('week.length == 0');
                    }
                };
            };
        };
    }, [])
    //stripe_load();
    return (
        <>
            <div className='block-dashboard'>
                SUBSCRIPTIONS
            </div>
            <Panel>
            <div>
                <table>
                    <tr className='table-subscription-header'>
                        <th className='table-header-email'>Email Address</th>
                        <th>Frequency</th>
                        <th>Details</th>
                        <th></th>  
                    </tr>
                    {data?.dataEmail.map((el => {
                        return (
                            <>
                                <tr>
                                    <td className='table-subscription-email'>
                                        {el.email}
                                    </td>
                                    <td className='item-btn-type'>
                                        <span className={el.crontTimeType}>
                                            {el.crontTimeType}
                                        </span>
                                    </td>
                                    <td className='table-subscription-details'>
                                        {cronstrue.toString(el.cronTime, { verbose: true })}, Time zone {el.timeZone}
                                    </td>
                                    <td className='table-subscription-btn'>
                                        <Button
                                            id={el._id}
                                            type="submit"
                                            onClick={deleteEmailItem}
                                        >
                                            Unsubscribe
                                        </Button>
                                    </td>
                                </tr>
                            </>
                        )
                    }))}
                </table>
            </div>
            </Panel>
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
                    {/* <Button type="button" onClick={() => router.push('/subscriptions')}>
                        Subscribe list
                    </Button> */}
                </Panel>
            </div>
        </>
    );
};

export default subscriptionsPage;
