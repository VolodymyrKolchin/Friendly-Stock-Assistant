import {Panel, H4, Flex, StyledBox, Box} from '@bigcommerce/big-design';

const aboutPage = () => {


    return (
        <Panel header='About the app'>
                <Panel>
                  <p>Effective inventory management and inventory control are one and the same, and the definition is pretty simple to understand.</p>
                  <p>Inventory management refers to the process by which you keep track of how many units of each item you have on your warehouse shelf, in your store, or with other retailers and distributors.</p>
                  <p>This allows you to have the right products in the right quantity in the right place, at the right time and at the right price. By effectively tracking and controlling your inventory, you'll know how much of each item you have, when you may be short on items, and whether you need to restock to keep selling them.</p>
                  <p>And as a busy business owner, you should be able to do all this at a glance. This makes it quick and easy to make good purchasing decisions. The right inventory management system is also important here, as we'll find out later.</p>
                </Panel>
                <Panel header="Unfortunately, there is no default way to view products and their variants in the BigCommerce admin. So this app is built for that purpose.">
                    <H4>BENEFITS</H4>
                    <ul>
                        <li>
                            Easy installation.
                        </li>
                        <li>
                            Load a list of products in BigCommerce and their variants.
                        </li>
                        <li>
                            Facilitates decision making because you know when to order products with a small inventory.
                        </li>
                        <li>
                            Automatically send a report, with the ability to specify how often the report is sent (once a day, once a week, once a month, etc.).
                        </li>
                        <li>
                            Ability to choose the exact time and time zone for the formation of the report.
                        </li>
                    </ul>
                </Panel>
<Flex>




                </Flex>
        </Panel>
    );
};

export default aboutPage;
