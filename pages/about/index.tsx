import {Panel, H4, Flex, Box} from '@bigcommerce/big-design';

const aboutPage = () => {

    return (
        <Panel header='About the app'>
        <div>
            <div className='logo__about_page'>
                <img src='./FOC-logo.png'/>
            </div>
        </div>
        <p>Lets use the following in the About tab</p>
        <p>Stock Assistant by Friends of Commerce gives an advanced and easy to read view of your BigCommerce inventory, with visual warnings for Low Stock and Out of Stock inventory.</p>
        <p>Set up automated inventory reports to be emailed directly to your team in the time zone and recurrence desired. Daily, Weekly, Monthly and more to chose from.</p>
            <ul>
                <li>
                    - Easy to read inventory view
                </li>
                <li>
                    - Easily expanded view to display nested variant skus
                </li>
                <li>
                    - Setup your team with automated inventory report subscriptions, to receive when needed
                </li>
                <li>
                    - Automatically send a report, with the ability to specify how often the report is sent (once a day, once a week, once a month, etc.).
                </li>
                <li>
                    - Friendly and Easy to use
                </li>
            </ul>
        </Panel>
    );
};

export default aboutPage;
