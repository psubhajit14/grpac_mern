import { getDocs, collection, getDocsFromCache } from "firebase/firestore";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { isAdmin } from "../database/authUtil";
import { auth, firestore } from "../database/firebaseUtil";
import { Result, Button, Row, Typography, Divider, Table, InputRef, Input, Space, TableProps, Image } from "antd";
import { CSVLink } from "react-csv";
import { ColumnType, ColumnsType, FilterConfirmProps } from "antd/es/table/interface";
import { BiSearchAlt } from "react-icons/bi";
import dayjs, { Dayjs } from "dayjs";
const localizedFormat = require('dayjs/plugin/localizedFormat')

export const PaymentDetails: React.FC<any> = () => {
    dayjs.extend(localizedFormat);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (user != null) {
            console.log(user)
        } else {
            navigate("/user", { replace: true })
        }
    }, [user])
    interface DataType {
        id: string,
        regID: string,
        url: string,
        uploadedOn: Dayjs
    }

    type DataIndex = keyof DataType;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>([]);
    const [admin, setAdmin] = useState(false);
    const getDBData = useCallback(async () => {
        if (await isAdmin(user?.uid || " ")) {
            setLoading(true)
            let snapshot: any;
            try {
                snapshot = await getDocs(collection(firestore, "payments"));
            }
            catch (e) {
                snapshot = await getDocsFromCache(collection(firestore, "payments"));
            }
            if (!snapshot.empty)
                setData(snapshot?.docs.map((item: any) => ({ ...item.data(), uploadedOn: dayjs(item.data().uploadedOn.toDate()), id: item.id })));
            setLoading(false)
            setAdmin(true)
        }

    }, [user])


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
            title: 'Reg. ID',
            dataIndex: 'regID',
            sorter: (a, b) => a.regID.localeCompare(b.regID),
            sortDirections: ['descend'],
            width: 50,
            fixed: "left",
            ...getColumnSearchProps('regID')
        },
        {
            title: 'Image',
            dataIndex: 'url',
            width: 100,
            render: (value, record, index) => <Image
                width={200}
                src={value}
                preview={{
                    src: value,
                }}
            />,
        },
        {
            title: 'Uploaded On',
            dataIndex: 'uploadedOn',
            sorter: (a, b) => (a.uploadedOn.isAfter(b.uploadedOn) ? 1 : 0),
            sortDirections: ['descend', 'ascend'],
            width: 100,
            render: (value, record, index) => <Typography.Paragraph>{record.uploadedOn.format('LLLL')}</Typography.Paragraph>
        },
    ];

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const headers = [
        { label: "Registration ID", key: "regID" },
        { label: 'Image', key: 'url' },
        { label: 'Uploaded On', key: 'uploadedOn' },
    ];


    return (
        <>{
            !admin ?

                <Result
                    status="403"
                    title={`Hi ${user?.displayName || "Guest"}`}
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
                />

                :
                <>
                    <Row align="middle" justify="space-between">
                        <Typography.Title>Payment Details</Typography.Title>
                    </Row>
                    <Divider />
                    <Button type="primary" style={{ marginBottom: 16 }}><CSVLink data={data} headers={headers} filename="GRPAC_Payment_Record">Export to CSV</CSVLink></Button>

                    <Table loading={loading} columns={columns} dataSource={data} onChange={onChange} rowKey="id"
                        pagination={{ pageSize: 2, hideOnSinglePage: true }}
                        showSorterTooltip
                        scroll={{ x: 768, y: 600 }}
                        summary={(data: readonly DataType[]) => (
                            searchText &&
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={3}>Showing result for {searchedColumn} containing : "{searchText}"</Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    /></>
        }</>
    );
}