import {Panel, Button, Message} from '@bigcommerce/big-design';
import {useProductListAll} from '../../lib/hooks';
import {useEffect, useState} from 'react';
import cronstrue from 'cronstrue';

const subscriptionsPage = () => {
    const [isShownUnsubscribe, setIsShownUnsubscribe] = useState(false);
    const { error, isLoading, list = [], meta = {}, mutateList=[], data } = useProductListAll();

    const clientData = [];

    if(!isLoading) {
        console.log('isLoading data', data)
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
        <Panel header='List of all subscriptions'>

        <div className='border-item-crontime' id='day'>
            <div className='title-cron-time'>DAY</div>
                {data?.dataEmail.map((el)=>{
                    return  <>{el.crontTimeType =="day" ? 
                    <li className="form-control-item day-li">
                        <li className="form-control-delete">
                            <Button
                                id={el._id}
                                type="submit"
                                onClick={deleteEmailItem}
                            >Unsubscribe
                            </Button>
                            {el.email} ({cronstrue.toString(el.cronTime, { verbose: true })}, Time zone {el.timeZone})
                            <div className='hide-message'>
                                <Message
                                    type="warning"
                                    messages={[{ text: `${el.email} has unsubscribed` }]}
                                    marginVertical="medium"
                                />
                            </div>
                        </li>
                        <div className='hide-message'>
                            <Message
                                type="warning"
                                messages={[{ text: `${el.email} has unsubscribed` }]}
                                marginVertical="medium"
                            />
                        </div>
                    </li>  : <></>}
                    
                    </>
                })    
                }
                </div>
                    
                <div className='border-item-crontime' id='week'>
                <div className='title-cron-time'>WEEK</div>
                {data?.dataEmail.map((el)=>{
                    return  <>{el.crontTimeType =="week" ? 
                                <li className="form-control-item week-li">
                                    <li className="form-control-delete">
                                        <Button
                                            id={el._id}
                                            type="submit"
                                            onClick={deleteEmailItem}
                                        >Unsubscribe
                                        </Button>
                                        {el.email} ({cronstrue.toString(el.cronTime, { verbose: true })}, Time zone {el.timeZone})
                                        <div className='hide-message'>
                                            <Message
                                                type="warning"
                                                messages={[{ text: `${el.email} has unsubscribed` }]}
                                                marginVertical="medium"
                                            />
                                        </div>
                                    </li>
                                    <div className='hide-message'>
                                        <Message
                                            type="warning"
                                            messages={[{ text: `${el.email} has unsubscribed` }]}
                                            marginVertical="medium"
                                        />
                                    </div>
                                </li>
                                : <></>}
                            </>
                })    
                }
                </div>
                
                <div className='border-item-crontime' id='month'>
                <div className='title-cron-time'>MONTH</div>
                {data?.dataEmail.map((el)=>{
                    return  <>{el.crontTimeType =="month" ? 
                    <li className="form-control-item month-li">
                        <li className="form-control-delete">
                            <Button
                                id={el._id}
                                type="submit"
                                onClick={deleteEmailItem}
                            >Unsubscribe
                            </Button>
                            {el.email} ({cronstrue.toString(el.cronTime, { verbose: true })}, Time zone {el.timeZone})
                            <div className='hide-message'>
                                <Message
                                    type="warning"
                                    messages={[{ text: `${el.email} has unsubscribed` }]}
                                    marginVertical="medium"
                                />
                            </div>
                        </li>
                        <div className='hide-message'>
                            <Message
                                type="warning"
                                messages={[{ text: `${el.email} has unsubscribed` }]}
                                marginVertical="medium"
                            />
                        </div>
                    </li>  : <></>}
                    
                    </>
                })    
                }
                </div>
        
        </Panel>
    );
};

export default subscriptionsPage;
