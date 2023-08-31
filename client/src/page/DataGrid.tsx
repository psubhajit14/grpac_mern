import { Button, Col, Divider, Input, InputRef, Row, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { getDocs, collection, getDocsFromCache } from "@firebase/firestore"
import { firestore } from "../database/firebaseUtil";
import * as Constants from "../data";
import { FilterConfirmProps } from "antd/es/table/interface";
import { BiSearchAlt } from 'react-icons/bi'
import { FaDonate } from 'react-icons/fa'
import { Link } from "react-router-dom";
import { paymentContext } from "../util/state";
import GooglePayButton from "@google-pay/button-react";
import { CSVLink } from "react-csv";
/** Launches payment request flow when user taps on buy button. */
function onBuyClicked() {
    if (!window.PaymentRequest) {
        console.log('Web payments are not supported in this browser.');
        return;
    }

    // Create supported payment method.
    const supportedInstruments: any = [
        {
            supportedMethods: ['https://tez.google.com/pay'],
            data: {
                pa: 'merchant-vpa@xxx',
                pn: 'Merchant Name',
                tr: '1234ABCD',  // Your custom transaction reference ID
                url: 'https://url/of/the/order/in/your/website',
                mc: '1234', //Your merchant category code
                tn: 'Purchase in Merchant',
            },
        }
    ];

    // Create order detail data.
    const details = {
        total: {
            label: 'Total',
            amount: {
                currency: 'INR',
                value: '10.01', // sample amount
            },
        },
        displayItems: [{
            label: 'Original Amount',
            amount: {
                currency: 'INR',
                value: '10.01',
            },
        }],
    };

    // Create payment request object.
    let request: any = null;
    try {
        request = new PaymentRequest(supportedInstruments, details);
    } catch (e: any) {
        console.log('Payment Request Error: ' + e.message);
        return;
    }
    if (!request) {
        console.log('Web payments are not supported in this browser.');
        return;
    }
    // Global key for canMakepayment cache.
    const canMakePaymentCache = 'canMakePaymentCache';

    /**
     * Check whether can make payment with Google Pay or not. It will check session storage
     * cache first and use the cache directly if it exists. Otherwise, it will call
     * canMakePayment method from PaymentRequest object and return the result, the
     * result will also be stored in the session storage cache for future usage.
     *
     * @private
     * @param {PaymentRequest} request The payment request object.
     * @return {Promise} a promise containing the result of whether can make payment.
     */
    function checkCanMakePayment(request: any) {
        // Check canMakePayment cache, use cache result directly if it exists.
        if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
            return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
        }

        // If canMakePayment() isn't available, default to assume the method is
        // supported.
        var canMakePaymentPromise = Promise.resolve(true);

        // Feature detect canMakePayment().
        if (request.canMakePayment) {
            canMakePaymentPromise = request.canMakePayment();
        }

        return canMakePaymentPromise
            .then((result) => {
                // Store the result in cache for future usage.
                sessionStorage[canMakePaymentCache] = result;
                return result;
            })
            .catch((err) => {
                console.log('Error calling canMakePayment: ' + err);
            });
    }
}

/**
* Show the payment request UI.
*
* @private
* @param {PaymentRequest} request The payment request object.
* @param {Promise} canMakePayment The promise for whether can make payment.
*/
function showPaymentUI(request: any, canMakePayment: any) {
    if (!canMakePayment) {
        //   handleNotReadyToPay();
        return;
    }

    // Set payment timeout.
    let paymentTimeout = window.setTimeout(function () {
        window.clearTimeout(paymentTimeout);
        request.abort()
            .then(function () {
                console.log('Payment timed out after 20 minutes.');
            })
            .catch(function () {
                console.log('Unable to abort, user is in the process of paying.');
            });
    }, 20 * 60 * 1000); /* 20 minutes */

    request.show()
        .then(function (instrument: any) {

            window.clearTimeout(paymentTimeout);
            console.log("success")
            // processResponse(instrument); // Handle response from browser.
        })
        .catch(function (err: any) {
            console.log(err);
        });
}

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
            fixed: "left"
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
            title: 'Mouza',
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
                <>{value === uid ? <Button onClick={() => { onBuyClicked() }}>Donate</Button> : null}</>
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
                <Button type="primary"><CSVLink data={data} headers={headers} filename="GRPAC_DATA_Record">Export to CSV</CSVLink></Button>
            </Row>
            <Divider />
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
