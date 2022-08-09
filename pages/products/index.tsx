import { Button, Dropdown, Panel, Small, Link as StyledLink, Table, TableSortDirection } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {ReactElement, useEffect, useState} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import { useProductList } from '../../lib/hooks';


const Products = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [columnHash, setColumnHash] = useState('');
    const [direction, setDirection] = useState<TableSortDirection>('ASC');
    const router = useRouter();
    const { error, isLoading, list = [], meta = {} } = useProductList({
      page: String(currentPage),
      limit: String(itemsPerPage),
      ...(columnHash && { sort: columnHash }),
      ...(columnHash && { direction: direction.toLowerCase() }),
    });
    const itemsPerPageOptions = [10, 20, 50, 100];
     
    const tableItems = list.map(({ id, inventory_level: stock, name, price, cost_price, variants, primary_image, images }) => ({
        id,
        name,
        price,
        stock,
        variants,
        cost_price,
        primary_image,
        images
    }));

    const dataProductVariants= [];
    if(!isLoading) {
        list.forEach((el)=>{
            dataProductVariants.push(...el.variants)
        })
        const aScript = document.createElement('script');
        aScript.type = 'text/javascript';
        aScript.src = "./jquery.min.js";

        document.head.appendChild(aScript);
        aScript.onload = () => {
             
            console.log('load script tablesorter.js');
        
            const cScript = document.createElement('script');
            cScript.type = 'text/javascript';
            cScript.src = "./jquery.tablesorter.min.js";

            document.head.appendChild(cScript);
            cScript.onload = () => {
                console.log('load script tablesorter.js');
                const dScript = document.createElement('script');
                dScript.type = 'text/javascript';
                dScript.src = "./custom-tablesorter.js";

                document.head.appendChild(dScript);
                dScript.onload = () => {
                    console.log('load script custom-tablesorter.js');
                }
            }
            console.log('load script page list products');
            const bScript = document.createElement('script');
            bScript.type = 'text/javascript';
            bScript.src = "./accordion.js";

            document.head.appendChild(bScript);
            bScript.onload = () => {
                console.log('load script accordion.js');
            }
            
            const qScript = document.createElement('link');
            qScript.rel = 'stylesheet';
            qScript.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css";

            document.head.appendChild(qScript);
            qScript.onload = () => {
                console.log('load link fontawesome.css');
            }
            
            tableItems.map((el)=>{
                if(el.variants.length > 1) {
                    $(`#${el.id} > .product-stock-icon > .good`).addClass('block_visible');
                }
                el.variants.map((index)=>{
                    if(index.inventory_level < index.inventory_warning_level && index.inventory_level!==0) {
                        $(`#${el.id} > .product-stock-icon > .low_stock`).addClass('block_visible');
                    }
                    if(index.inventory_level===0) {
                        $(`#${el.id} > .product-stock-icon > .out_of_stock`).addClass('block_visible');
                    }
                })
            })
        };
    }

    const onItemsPerPageChange = newRange => {
        setCurrentPage(1);
        setItemsPerPage(newRange);
    };

    const onSort = (newColumnHash, newDirection: TableSortDirection) => {
        setColumnHash(newColumnHash === 'stock' ? 'inventory_level' : newColumnHash);
        setDirection(newDirection);
    };

    const renderName = (id, name): ReactElement => (
        <Link href={`/products/${id}`}>
            <StyledLink>{name}</StyledLink>
        </Link>
    );

    const renderPrice = (price): string => (
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
    );

    const renderStock = (stock): ReactElement => (stock > 0
        ? <Small>{stock}</Small>
        : <Small bold marginBottom="none" color="danger">0</Small>
    );

    const renderAction = (id): ReactElement => (
        <Dropdown
            items={[ { content: 'Edit product', onItemClick: () => router.push(`/products/${id}`), hash: 'edit' } ]}
            toggle={<Button iconOnly={<MoreHorizIcon color="secondary60" />} variant="subtle" />}
        />
    );

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return ( <>
        <div className="table-hidden">
            <Table
            columns={[
                { header: 'Product Name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true, hideHeader: true},
                { header: 'Stock', hash: 'stock', render: ({ stock }) => renderStock(stock), isSortable: true, hideHeader: true},
                { header: 'Stock Health', hash: 'stock', render: ({ stock }) => renderStock(stock), isSortable: true, hideHeader: true},
                { header: 'Sale Price', hash: 'price', render: ({ price }) => renderPrice(price), isSortable: true, hideHeader: true},
                { header: 'Cost', hash: 'cost_price', render: ({ cost_price }) => renderPrice(cost_price), isSortable: true, hideHeader: true},
                { header: 'Profit, %', hash: 'price', render: ({ price }) => renderPrice(price), isSortable: true, hideHeader: true},
            ]}
            items={tableItems}
            itemName="Products"
            pagination={{ 
                currentPage,
                totalItems: meta?.pagination?.total,
                onPageChange: setCurrentPage,
                itemsPerPageOptions,
                onItemsPerPageChange,
                itemsPerPage,
            }}
            sortable={{
              columnHash,
              direction,
              onSort,
            }}
            stickyHeader
        />
        </div>
        <div className="table-background">
            <table id="myTable" className="tablesorter fold-table">
            <thead className="styled__thead-1">
                <tr className="tr-thead">
                    <th className=" name-thead">
                        Product Name
                    </th>
                    <th className=" stock-thead">
                        Stock
                    </th>
                    <th className=" stock-thead">
                        Stock Health
                    </th>
                    <th className=" price-thead">
                        Sale Price
                    </th>
                    <th className=" price-thead">
                        Cost
                    </th>
                    <th className=" price-thead">
                        Profit, %
                    </th>
                </tr>
                </thead>
                <tbody>
                {tableItems.map((el)=>{
                    let cost = ((el.cost_price/el.price)*100).toFixed(2);
                    return(
                    <>
                        <tr className="view" id={el.id}>
                            <td className="product-name">
                                <i className="fa fa-angle-right" aria-hidden="true"></i>
                                <p>{el.name}</p>
                            </td>
                            <td className="product-stock">
                                {el.stock}
                            </td>
                            <td className="product-stock-icon">
                                <div className='out_of_stock'>
                                    <span>
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </span>Out of Stock</div>    
                                <div className='low_stock'>
                                    <span>
                                        <i className="fa fa-exclamation" aria-hidden="true"></i>
                                    </span>Low Stock</div>
                                <div className='good'>
                                    <span>
                                        <i className="fa fa-check-circle" aria-hidden="true"></i>
                                    </span>Good</div> 
                            </td>
                            <td className="product-price">
                                ${el.price}
                            </td>
                            <td className="product-cost">
                                ${el.cost_price}
                            </td>
                            <td className="product-cost-price">
                                {cost}%
                            </td>
                        </tr>
                        <tr className='fold'>
                            <td colSpan={6}>
                                <div className='fold-content'>
                                    <table className='fold-table'>
                                    <tbody>
                                    {el.variants.map((element)=>{
                                        console.log('element!!', element);
                                        return (
                                            <tr>
                                                <td className="product-name">
                                                <p>SKU: {element.sku}</p>
                                                </td>
                                                <td className="product-stock">
                                                    {element.inventory_level}
                                                </td>
                                                <td className="product-stock">
                                                 
                                                </td>
                                                <td className="product-price">
                                                    {element.price > 0
                                                        ? <div className='element_price'>${element.price}</div>
                                                        : <div className='el_price'>${el.price}</div>
                                                    }
                                                </td>
                                                <td className="product-cost">

                                                </td>
                                                <td className="product-cost-price">

                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </>
                    )
                })}
                </tbody>
            </table> 
        </div>
        </>
    );
};

export default Products;
