import { Box, Flex, H1, H4, Panel } from '@bigcommerce/big-design';
import styled from 'styled-components';
import ErrorMessage from '../components/error';
import Loading from '../components/loading';
import { useProducts } from '../lib/hooks';
import { useProductListTotalSellers, listProductProfit } from '../lib/hooks';

const Index = () => {
    const { error, isLoading, summary } = useProducts();
    const { data = [], mutateList } = listProductProfit();
    const { list = [], meta = {} } = useProductListTotalSellers();

    let newListProductProfit = [];
    data.map(el =>{
        let cost = ((el.cost_price/el.price)*100).toFixed(2);
        el.profit = parseInt(cost);
        newListProductProfit.push(el);
    })
        
    let listProduct = list.sort((a, b) => a.inventory_level < b.inventory_level ? 1 : -1).slice(0, 5);

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <>
        <div className='block-dashboard'>
            Dashboard
        </div>
            <Flex className='info-block'>
                <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Inventory count</H4> 
                    <H1 marginBottom="none">{summary.inventory_count}</H1>
                </StyledBox>
                <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Total Variants</H4> 
                    <H1 marginBottom="none">{summary.variant_count}</H1>
                </StyledBox>
                <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Primary category</H4> 
                    <H1 marginBottom="none">{summary.primary_category_name}</H1>
                </StyledBox>
                <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Total Sales</H4> 
                </StyledBox>
                <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Costs</H4> 
                </StyledBox>
                <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                    <H4>Profit</H4> 
                </StyledBox>
            </Flex>
            <div className="row-table">
                <Flex className='table-info-block table-info-block-left'>
                    <div className='header-info-block'>
                        <h3>Top Sellers</h3>
                    </div>
                    <div className="table-item">
                        <table className='table-block'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>QTY</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            {listProduct.map((el)=>{
                                return (<tr>
                                        <td>{el.name}</td>
                                        <td>{el.inventory_level}</td>
                                        <td>${el.price}</td>
                                    </tr>)
                            })}
                        </table>
                    </div>
                </Flex>
                <Flex className='table-info-block'>
                    <div className='header-info-block'>
                        <h3>Most Profitable</h3>
                    </div>
                    <div className="table-item">
                    <table className='table-block'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>QTY</th>
                                <th>Cost</th>
                                <th>Total Profit</th>
                            </tr>
                        </thead>
                        { newListProductProfit.sort((a, b) => a.profit < b.profit ? 1 : -1).slice(0, 5).map(el=>{
                            return (<tr>
                                <td>{el.name}</td>
                                <td>{el.inventory_level}</td>
                                <td>$ {el.cost_price}</td>
                                <td>{el.profit}, %</td>
                            </tr>)
                        })}
                        </table>
                    </div>
                </Flex>
            </div>
        <div className="row-dashboard-item">
            <div className='block-low-stock'>
                <p>Low Stock Items</p>
                <div className='low-stock-count'>10</div>
                <img src="./dashboard_table.png" alt="" />
            </div>
            <div className='block-about'>
                <Panel header='About'>
                    <div>
                        <div className='logo__about_page'>
                            <img src='./FOC-logo.png'/>
                        </div>
                    </div>
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
                </div>
            </div>
        </>
    );
};

const StyledBox = styled(Box)`
    min-width: 10rem;
`;

export default Index;
