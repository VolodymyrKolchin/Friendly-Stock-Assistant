import { Button, Dropdown, Panel, Small, Link as StyledLink, Table, TableSortDirection } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {ReactElement, useEffect, useState} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import { useProductList } from '../../lib/hooks';
import { TableItem } from '../../types';


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
    console.log('list', list);
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

        /* */
        /* */
        document.head.appendChild(aScript);
        aScript.onload = () => {
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
            tableItems.map((el)=>{
                if(el.variants.length > 1) {
                    $(`#${el.id}`).addClass('add_icons_item');
                }
                el.variants.map((index)=>{
                    if(index.inventory_level < index.inventory_warning_level && index.inventory_level!==0) {
                        $(`#${el.id}`).addClass('background__yellow_item');
                    }
                    if(index.inventory_level===0) {
                        $(`#${el.id}`).addClass('background__red_item');
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

    return (
        <Panel>
            <Table
            columns={[
                { header: 'Product name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true},
                { header: 'Stock', hash: 'stock', render: ({ stock }) => renderStock(stock), isSortable: true},
                { header: 'Sale Price', hash: 'price', render: ({ price }) => renderPrice(price), isSortable: true},
                { header: 'Cost', hash: 'cost_price', render: ({ cost_price }) => renderPrice(cost_price), isSortable: true},
                { header: 'Profit, %', hash: 'price', render: ({ price }) => renderPrice(price), isSortable: true},
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
            <table className="table-list-products">
            <thead className="styled__thead">
                <tr className="tr-thead">
                    <th className="product-name product-name-thead">
                        Product name
                    </th>
                    <th className="stock product-stock-thead">
                        Stock
                    </th>
                    <th className="price product-price-thead">
                        Sale Price
                    </th>
                    <th className="price product-price-thead">
                        Cost
                    </th>
                    <th className="price product-price-thead">
                        Profit, %
                    </th>
                </tr>
            </thead>
            <tbody>
            {tableItems.map((el)=>{
                let cost = ((el.cost_price/el.price)*100).toFixed(2);
                return(
                <>
                    <tr className="accordion" id={el.id}>
                        <td className="product-name">
                            <img src={el.images[0].url_thumbnail} alt="" />
                            <p>{el.name}</p>
                        </td>
                        <td className="product-stock">
                            {el.stock}
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
                    <div className="panel">
                    {el.variants.map((element)=>{
                        return (
                            <tr>
                                <td className="product-name">
                                   SKU: {element.sku}
                                </td>
                                <td className="product-stock product-stock-block">
                                   {element.inventory_level < element.inventory_warning_level && element.inventory_level !==0
                                        ? <span className='background_light_yellow background_stock' >Stock: {element.inventory_level}</span>
                                        : <span>{element.inventory_level==0 ? <span className='background_red background_stock'>Stock: {element.inventory_level}</span>:<span>Stock: {element.inventory_level}</span>}</span>
                                   }
                                </td>
                                <td className="product-price">
                                    {element.price > 0
                                        ? <div className='element_price'>${element.price}</div>
                                        : <div className='el_price'>${el.price}</div>
                                    }
                                </td>
                            </tr>
                        )
                    })}
                    </div>
                </>
                )
            })}
            </tbody>
        </table>
        <table id="myTable" className="tablesorter">
        <thead className="styled__thead">
                <tr className="tr-thead">
                    <th className="product-name product-name-thead">
                        Product name
                    </th>
                    <th className="stock product-stock-thead">
                        Stock
                    </th>
                    <th className="price product-price-thead">
                        Sale Price
                    </th>
                    <th className="price product-price-thead">
                        Cost
                    </th>
                    <th className="price product-price-thead">
                        Profit, %
                    </th>
                </tr>
            </thead>
            <tbody>
            {tableItems.map((el)=>{
                let cost = ((el.cost_price/el.price)*100).toFixed(2);
                return(
                <>
                    <tr className="accordion" id={el.id}>
                        <td className="product-name">
                            <img src={el.images[0].url_thumbnail} alt="" />
                            <p>{el.name}</p>
                        </td>
                        <td className="product-stock">
                            {el.stock}
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
                    <div className="panel">
                    {el.variants.map((element)=>{
                        return (
                            <tr>
                                <td className="product-name">
                                   SKU: {element.sku}
                                </td>
                                <td className="product-stock product-stock-block">
                                   {element.inventory_level < element.inventory_warning_level && element.inventory_level !==0
                                        ? <span className='background_light_yellow background_stock' >Stock: {element.inventory_level}</span>
                                        : <span>{element.inventory_level==0 ? <span className='background_red background_stock'>Stock: {element.inventory_level}</span>:<span>Stock: {element.inventory_level}</span>}</span>
                                   }
                                </td>
                                <td className="product-price">
                                    {element.price > 0
                                        ? <div className='element_price'>${element.price}</div>
                                        : <div className='el_price'>${el.price}</div>
                                    }
                                </td>
                            </tr>
                        )
                    })}
                    </div>
                </>
                )
            })}
            </tbody>
        </table>
        </Panel>
    );
};

export default Products;
