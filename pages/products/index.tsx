import { Button, Dropdown, Panel, Small, Link as StyledLink, Table, TableSortDirection } from '@bigcommerce/big-design';
import { MoreHorizIcon } from '@bigcommerce/big-design-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
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
    const tableItems = list.map(({ id, inventory_level: stock, name, price, variants }) => ({
        id,
        name,
        price,
        stock,
        variants,
    }));

    const dataProductVariants= [];
    if(!isLoading) {
        list.forEach((el)=>{
            dataProductVariants.push(...el.variants)
        })

        console.log("list", list);
        console.log('dataProductVariants2', dataProductVariants);
        console.log("tableItems", tableItems);
    }
    console.log('dataProductVariants', dataProductVariants);

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
                { header: 'Product name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true  },
                { header: 'Stock', hash: 'stock', render: ({ stock }) => renderStock(stock), isSortable: true  },
                { header: 'Price', hash: 'price', render: ({ price }) => renderPrice(price), isSortable: true  },
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
                    <th className="price .product-price-thead">
                        Price
                    </th>
                </tr>
            </thead>
            <tbody>
            {tableItems.map((el)=>{
                return(
                <>
                    <tr>
                        <td className="product-name">
                            <a href="">{el.name}</a>
                        </td>
                        <td className="product-stock">
                            {el.stock}
                        </td>
                        <td className="product-price">
                            {el.price}
                        </td>
                    </tr>
                    {el.variants.map((element)=>{
                        return (
                            <tr>
                                <td className="product-name">
                                   SKU: {element.sku}
                                </td>
                                <td>
                                   {element.inventory_level}
                                </td>
                                <td>
                                    {element.price > 0
                                        ? <div className='element_price'>{element.price}</div>
                                        : <div className='el_price'>{el.price}</div>
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </>
                )
            })}
            </tbody>
        </table>
        </Panel>
    );
};

export default Products;
