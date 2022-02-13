import {Button, Flex, FormGroup, Input, Panel, Form as StyledForm, Message, Checkbox} from '@bigcommerce/big-design';
import {useState, ChangeEvent, useEffect} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import {useProductListAll} from '../../lib/hooks';
import { CSVLink } from 'react-csv';
import Script from 'next/script'
import $ from "jquery";

const importProducts = () => {
    const [isShownSuccess, setIsShownSuccess] = useState(false);
    const [isShownError, setIsShownError] = useState(false);
    const [formEmail, setFormEmail] = useState({ email: '' });
    const [isShownSuccessSubscribe, setIsShownSuccessSubscribe] = useState(false);
    const [isShownErrorSubscribe, setIsShownErrorSubscribe] = useState(false);
    const [isLoadingSubscribeShowEmail, setIsLoadingSubscribeShowEmail] = useState(false);
    const [isLoadingSubscribeShowCheckbox, setIsLoadingSubscribeShowCheckbox] = useState(false);
    const [form, setForm] = useState({ email: '', daily: false, weekly: false, workingDay: false, monthly:false, unsubscribe: false });

    const dataImportProduct = [];
    const { error, isLoading, list = [], meta = {}, mutateList=[], data } = useProductListAll();

    const clientData = [];
    if(!isLoading) {
        list.forEach((el)=>{
            dataImportProduct.push(...el.variants)
        })
        clientData.push(process.env.CLIENT_ID);
    }

    // if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;
    // if (typeof document === "undefined") {
    //     console.log('document === "undefined"');
    // } else {
    //     console.log('document !== "undefined"');
    //     return (<Script id="show-ban" >
    //         {`$(document).ready(function() {
    //             $('#my-custom-id').cron({
    //             initial: "42 3 * * *",
    //             onChange: function() {
    //                 $('#example1-val').text($(this).cron("value"));
    //             }
    //             });
    //         });`}
    //     </Script>)
    // }
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
        // https://express-heroku-app-email.herokuapp.com/send
        // http://localhost:8080/send
        fetch('https://express-heroku-app-email.herokuapp.com/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({dataSCV: dataImportProduct, formEmail: formEmail})
        }).then((response)=> {
            console.log('response', response);
            setIsShownSuccess(!isShownSuccess);
        }).catch((error)=> {
            console.log('error', error);
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

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked, name: formName } = event?.target;
        setForm({ email:form.email, daily: false, weekly: false, workingDay: false, monthly:false, unsubscribe: false });
        setForm(prevForm => ({ ...prevForm, [formName]: checked }));
        setIsLoadingSubscribeShowCheckbox(false);
    };

    const onClickBtnSubscribe = (e) => {
        if(form.email === '' ) {
            setIsLoadingSubscribeShowEmail(true);
            return;
        }
        if (form.daily === false && form.weekly === false && form.workingDay === false && form.monthly=== false && form.unsubscribe === false) {
            setIsLoadingSubscribeShowCheckbox(true);
            return;
        }
        if (e.target.nodeName || e.target.parentElement.nodeName == 'BUTTON') {
            e.target.setAttribute('disabled', 'true');
            e.target.parentElement.setAttribute('disabled', 'true');
        }
        // https://express-heroku-app-email.herokuapp.com/send
        // http://localhost:8080/send
        fetch('https://express-heroku-app-email.herokuapp.com/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                form: form,
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
                setIsLoadingSubscribeShowCheckbox(false);
                setIsLoadingSubscribeShowEmail(false);
                setTimeout(() => {
                    setIsShownSuccessSubscribe(false);
                    setIsShownErrorSubscribe(false);
                    setForm({ email:'', daily: false, weekly: false, workingDay: false, monthly:false, unsubscribe: false });
                }, 4000);
            })
    }
    useEffect(() => {
        const aScript = document.createElement('script');
        aScript.type = 'text/javascript';
        aScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js";

        document.head.appendChild(aScript);
        aScript.onload = () => {
            console.log('script load');
        };
        const bScript = document.createElement('script');
        bScript.type = 'text/javascript';
        bScript.src = "https://admin.fa.gov.sa/CDN/admin/shawnchin-jquery-cron/cron/jquery-cron-min.js";

        document.head.appendChild(bScript);
        bScript.onload = () => {
            console.log('script load 222')
        };
        const cScript = document.createElement('script');
        cScript.type = 'text/javascript';
        cScript.src = "./custom.js";

        document.head.appendChild(cScript);
        cScript.onload = () => {
            console.log('script load 3!')
        };

    }, [])
    //stripe_load();



    return (
        <Panel>



            <div id='cron'/>
            <div id='example1-val'></div>
            <div id='my-custom-id' className=' 1122'>qwerty</div>
            <Panel header="Download products BigCommerce">
                <CSVLink
                    data={dataImportProduct}
                    className="btn btn-primary"
                    filename={"BigCommerce-import-products.csv"}
                >
                    Download.csv
                </CSVLink>
            </Panel>
            <StyledForm onSubmit={handleSubmit}>
                <Panel header="Send BigCommerce product import file by Email">
                    <FormGroup>
                        <Input
                            label="Enter Email"
                            name="email"
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
            <Panel header="Subscribe to our newsletter">
                <p>Get the latest updates on new products and stock level</p>
                <FormGroup>
                    <Input
                        label="Enter Email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChangeForm}
                    />
                </FormGroup>
                {isShownSuccessSubscribe &&
                    <Message
                        type="success"
                        messages={[{ text: 'Email sent successfully ' }]}
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
                <FormGroup>
                    <Checkbox
                        name="daily"
                        checked={form.daily}
                        onChange={handleCheckboxChange}
                        label="Send daily"
                    />
                    <Checkbox
                        name="workingDay"
                        checked={form.workingDay}
                        onChange={handleCheckboxChange}
                        label="Send daily (Monday through Friday only) "
                    />
                    <Checkbox
                        name="weekly"
                        checked={form.weekly}
                        onChange={handleCheckboxChange}
                        label="Sending weekly (1 email per week)"
                    />
                    <Checkbox
                        name="monthly"
                        checked={form.monthly}
                        onChange={handleCheckboxChange}
                        label="Sending monthly "
                    />
                    <Checkbox
                        name="unsubscribe"
                        checked={form.unsubscribe}
                        onChange={handleCheckboxChange}
                        label="Unsubscribe from mailing list "
                    />
                    {isLoadingSubscribeShowCheckbox &&
                        <Message
                            type="warning"
                            messages={[{ text: 'Choose one of the subscription options (every day, once a week, etc.)' }]}
                            marginVertical="medium"
                        />
                    }
                    <Flex justifyContent="flex-end">
                        <Button
                            type="submit"
                            onClick={onClickBtnSubscribe}
                        >
                            Subscribe
                        </Button>
                    </Flex>
                </FormGroup>
            </Panel>
        </Panel>
    );
};

export default importProducts;
