import { Button, Divider, Input, InputRef, Row, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { getDocs, collection, getDocsFromCache } from "@firebase/firestore"
import { firestore } from "../database/firebaseUtil";
import { FilterConfirmProps } from "antd/es/table/interface";
import { BiSearchAlt } from 'react-icons/bi'
import { paymentContext } from "../util/state";
import { CSVLink } from "react-csv";

export const DataGrid: React.FC<any> = () => {

    interface DataType {
        id: string;
        name: string;
        email: string;
        gender: string;
        mobileNo: string;
        occupation: string;
        district: string;
        block: string;
        mouza: string;
        pin: string;
        donated: string;
        registration_id: string;
    }

    type DataIndex = keyof DataType;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>([]);
    const { setOpenModal, uid } = useContext(paymentContext)
    const getDBData = useCallback(async () => {
        setLoading(true)
        let snapshot: any;
        try {
            snapshot = await getDocs(collection(firestore, "users"));
        }
        catch (e) {
            snapshot = await getDocsFromCache(collection(firestore, "users"));
        }
        if (!snapshot.empty)
            setData(snapshot?.docs.map((item: any) => ({ ...item.data(), id: item.id })));
        setLoading(false)
    }, [])


    useEffect(() => {
        getDBData();
    }, [getDBData])
    console.log("data", data)

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const filterDropdownUtil = (dataIndex: any) =>
        ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) =>
        (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        )
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: filterDropdownUtil(dataIndex),
        filterIcon: (filtered: boolean) => (
            <BiSearchAlt style={{ color: filtered ? '#1677ff' : undefined, fontSize: 18 }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }

    });

    const columns: ColumnsType<DataType> = [
        {
            title: 'Registration ID',
            dataIndex: 'registration_id',
            width: 150,
            fixed: "left",
            ...getColumnSearchProps('registration_id')
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['descend'],
            width: 150

        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 250,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Sex',
            dataIndex: 'gender',
            width: 80,
            render: (value, _, __) => {
                return (
                    <>{value === "male" && <Tag>Male</Tag>}{value === "female" && <Tag>Female</Tag>}</>
                )
            },
        },
        {
            title: 'Contact No',
            dataIndex: 'mobileNo',
            width: 200,
            render: (value, _, __) => {
                return (
                    <>+91-{value.substr(0, 3) + '-' + value.substr(3, 3) + '-' + value.substr(6, 4)}</>
                )
            }
        },
        {
            title: 'Occupation',
            dataIndex: 'occupation',
            width: 150
        },
        {
            title: 'District',
            dataIndex: 'district',
            width: 150,
            render: (value, _, __) => value.split("] ")[1],
            ...getColumnSearchProps('district')
        },
        {
            title: 'Block',
            dataIndex: 'block',
            width: 150,
            render: (value, _, __) => value.split("] ")[1],
            ...getColumnSearchProps('block')
        },
        {
            title: 'Mouza / Village',
            dataIndex: 'mouza',
            width: 150,
            render: (value, _, __) => value?.split("] ")[1]
        },
        {
            title: 'Pin Code',
            dataIndex: 'pin',
            width: 100,
        },
        {
            title: 'Donated',
            dataIndex: 'donated',
            width: 100,
        },
        {
            title: "Action",
            dataIndex: "uuid",
            width: 100,
            render: (value, _, __) =>
                <>{value === uid ? <Button onClick={() => {
                    // onBuyClicked()
                }}>Donate</Button> : null}</>
            // <Button onClick={() => setOpenModal && setOpenModal(true)} type="primary">Donate Now</Button>
        }
    ];

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const headers = [
        { label: "Registration ID", key: "registration_id" },
        { label: 'Name', key: 'name' },
        { label: 'Email-ID', key: 'email' },
        { label: 'Gender', key: 'gender' },
        { label: 'Mobile No.', key: 'mobileNo' },
        { label: 'Occupation', key: 'occupation' },
        { label: 'District', key: 'district' },
        { label: 'Block', key: 'block' },
        { label: 'Mouza', key: 'mouza' },
        { label: 'PIN Code', key: 'pin' },
        { label: 'Donated', key: 'donated' },
    ];
    return (
        <>
            <Row align="middle" justify="space-between">
                <Typography.Title>Dashboard</Typography.Title>
            </Row>
            <Divider />
            <Button type="primary" style={{ marginBottom: 16 }}><CSVLink data={data} headers={headers} filename="GRPAC_DATA_Record">Export to CSV</CSVLink></Button>

            <Table loading={loading} columns={columns} dataSource={data} onChange={onChange} rowKey="id"
                pagination={{ pageSize: 5, hideOnSinglePage: true }}
                showSorterTooltip
                scroll={{ x: 1500, y: 600 }}
                summary={(data: readonly DataType[]) => (
                    searchText &&
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={10}>Showing result for {searchedColumn} containing : "{searchText}"</Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />
        </>
    );
}
