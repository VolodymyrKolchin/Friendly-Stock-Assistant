import {Button, Flex, FormGroup, Input, Panel, Form as StyledForm, Message, Checkbox} from '@bigcommerce/big-design';
import {useState, ChangeEvent} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import {useProductListAll} from '../../lib/hooks';
import { CSVLink } from 'react-csv';
import Script from 'next/script';

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

        // http://localhost:8080/send
        fetch('https://stock-assistant-friendsofcomme.herokuapp.com/subscribe', {
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

    return (
        <Panel>
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
                    <Script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js" strategy="beforeInteractive"/>
                    <Script src="https://admin.fa.gov.sa/CDN/admin/shawnchin-jquery-cron/cron/jquery-cron-min.js" strategy="beforeInteractive"/>
                    <Script id="show-ban" >
                        {`$(document).ready(function() {
                            $('#cron').cron({
                                initial: "0 9 * * *",
                                onChange: function() {
                                    $('#example1-val').text($(this).cron("value"));
                                }
                            });
                        });`}
                    </Script>

                    <div id='cron'></div>
                    <div id='example1-val'></div>

                    <Checkbox
                        name="unsubscribe"
                        checked={form.unsubscribe}
                        onChange={handleCheckboxChange}
                        label="Unsubscribe from mailing list "
                    />

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
