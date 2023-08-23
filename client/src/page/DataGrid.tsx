import { Button, Input, InputRef, Space, Table, Tag } from "antd";
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import { useCallback, useEffect, useRef, useState } from "react";

import { getDocs, collection, getDocsFromCache } from "@firebase/firestore"
import { firestore } from "../database/firebaseUtil";
import * as Constants from "../data";
import { FilterConfirmProps } from "antd/es/table/interface";
import { BiSearchAlt } from 'react-icons/bi'

export const DataGrid: React.FC<any> = () => {


    interface DataType {
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
    }
    type DataIndex = keyof DataType;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>([]);

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
            setData(snapshot?.docs.map((item: any) => item.data()));
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
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
        ),
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
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['descend'],
            fixed: "left"
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            render: (value, _, __) => {
                return (
                    <>{value === "male" && <Tag>Male</Tag>}{value === "female" && <Tag>Female</Tag>}</>
                )
            },
        },
        {
            title: 'Contact No',
            dataIndex: 'mobileNo',
            render: (value, _, __) => {
                return (
                    <>+91-{value.substr(0, 3) + '-' + value.substr(3, 3) + '-' + value.substr(6, 4)}</>
                )
            }
        },
        {
            title: 'Occupation',
            dataIndex: 'occupation',
            render: (value, _, __) => {
                return (
                    <>{Constants.data.occupationList.find(item => item.value === value)?.label}</>
                )
            }
        },
        {
            title: 'District',
            dataIndex: 'district',
            render: (value, _, __) => value.split("] ")[1],
            ...getColumnSearchProps('district')
        },
        {
            title: 'Block',
            dataIndex: 'block',
            render: (value, _, __) => value.split("] ")[1]
        },
        {
            title: 'Mouza',
            dataIndex: 'mouza',
            render: (value, _, __) => value?.split("] ")[1]
        },
        {
            title: 'Pin Code',
            dataIndex: 'pin',
        },
    ];

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <Table loading={loading} columns={columns} dataSource={data} onChange={onChange} pagination={{ pageSize: 5, hideOnSinglePage: true }} scroll={{ x: 1500, y: 600 }}
            summary={(data: readonly DataType[]) => (searchText && <Table.Summary.Row><Table.Summary.Cell index={0} colSpan={4}>Showing result for district containing "{searchText}"</Table.Summary.Cell></Table.Summary.Row>)}
        />
    );
}
