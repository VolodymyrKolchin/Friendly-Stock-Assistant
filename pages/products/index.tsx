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
            <table>
            <thead className="styled__thead">
                <tr>
                    <th className="product-name">
                        <div className="s">Product name</div>
                    </th>
                    <th className="stock">
                        <div className=" ">Stock</div>
                    </th>
                    <th className="price">
                        <div className="">Price</div>
                    </th>
                    <th className="action">
                        <div className="">Action</div>
                    </th>
                </tr>
            </thead>
            {tableItems.map((el)=>{
                return(
                <tr>
                    <th>
                        {el.name}
                    </th>
                    <th>
                        {el.price}
                    </th>
                    <th>
                        {el.stock}
                    </th>
                <table style={{width: '100%'}}>
                    <tr>
                        <td>Ячейка 2.1 - 1.1</td>
                        <td>Ячейка 2.1 - 1.2</td>
                    </tr>
                    <tr>
                        <td>Ячейка 2.1 - 2.1</td>
                        <td>Ячейка 2.1 - 2.2</td>
                    </tr>
                </table>
                </tr>
                )
            })}
        </table>



            <Table
                columns={[
                    { header: 'Product name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true },
                    { header: 'Stock', hash: 'stock', render: ({ stock }) => renderStock(stock), isSortable: true },
                    { header: 'Price', hash: 'price', render: ({ price }) => renderPrice(price), isSortable: true },
                    { header: 'Action', hideHeader: true, hash: 'id', render: ({ id }) => renderAction(id) },
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
        </Panel>
    );
};

export default Products;
