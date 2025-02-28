"use client";

import { useState,useEffect } from "react";
import { Form, Input, Button, Select, Table, DatePicker, Space, Modal } from "antd";
import dayjs from "dayjs";

export default function Tables() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [parties, setParties] = useState([]);
  const [items, setItems] = useState([]); // Fix: Define items state
  const [departments, setDepartments] = useState([]); // Fix: Define departments state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newParty, setNewParty] = useState("");
  const [regNo, setRegNo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ date: null, party: null, item: null, department: null, deptRef: null });
  
  
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [partyRes, itemRes, deptRes, registerRes] = await Promise.all([
          fetch("/api/party"),      // Fetch parties
          fetch("/api/item"),       // Fetch items
          fetch("/api/department"), // Fetch departments
          fetch("/api/register")    // Fetch register entries
        ]);
  
        if (!partyRes.ok || !itemRes.ok || !deptRes.ok || !registerRes.ok) {
          throw new Error("Failed to fetch dropdown data");
        }
  
        const [partyData, itemData, deptData, registerData] = await Promise.all([
          partyRes.json(),
          itemRes.json(),
          deptRes.json(),
          registerRes.json()
        ]);
  
        // Find the latest regNo from the database
        const latestRegNo = registerData.length
          ? Math.max(...registerData.map(entry => entry.regNo)) + 1
          : 1;
      
        setRegNo(latestRegNo); // Set regNo to the next number
        setParties(partyData);
        setItems(itemData);
        setDepartments(deptData);
      
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
  
    fetchDropdownData();
    fetchData();
  },[]);

  useEffect(() => {
    if (regNo) {
      form.setFieldsValue({ regNo }); // Update form field when regNo changes
    }
  }, [regNo]);
  
  
  const fetchData = async () => {
    try {
      const response = await fetch("/api/register");
      const result = await response.json();
  
      // Sort data by regNo in ascending order
      const sortedData = result.sort((a, b) => a.regNo - b.regNo);
  
      setData(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };
  
  
  useEffect(() => {
    let filtered = data.filter((entry) =>
      (!filters.date || dayjs(entry.date, "DD-MM-YYYY").isSame(dayjs(filters.date), "day")) &&
      (!filters.party || entry.party === filters.party) &&
      (!filters.item || entry.item === filters.item) &&
      (!filters.department || entry.department === filters.department) &&
      (!filters.deptRef || (filters.deptRef === "NULL" ? !entry.deptRef : entry.deptRef === filters.deptRef))
    );
  
    if (searchText) {
      filtered = filtered.filter(entry =>
        entry.party?.toLowerCase().includes(searchText.toLowerCase()) ||
        entry.item?.toLowerCase().includes(searchText.toLowerCase()) ||
        entry.department?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  
    setFilteredData(filtered);
  }, [filters, searchText, data]);

  const handleSubmit = async (values) => {
    try {
      // Fetch the latest regNo
      const response = await fetch("/api/register");
      const result = await response.json();
      const latestRegNo = result.length ? Math.max(...result.map(entry => entry.regNo)) + 1 : 1;
  
      const updatedValues = { ...values, regNo: latestRegNo, date: dayjs().format("DD-MM-YYYY") };
  
      // Save the new entry
      const saveResponse = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues),
      });
  
      const savedEntry = await saveResponse.json();
  
      if (saveResponse.ok) {
        setData([...data, savedEntry]);
        setFilteredData([...filteredData, savedEntry]); // Update filteredData
        setRegNo(latestRegNo + 1); // Update regNo for next entry
        form.resetFields();
        form.setFieldsValue({ regNo: latestRegNo + 1, date: dayjs().format("DD-MM-YYYY") });
      } else {
        console.error("Error saving data:", savedEntry);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
  
  
  
  

  const handleAddParty = () => {
    if (newParty && !parties.includes(newParty)) {
      setParties([...parties, newParty]);
    }
    setNewParty("");
    setIsModalVisible(false);
  };

  const columns = [
    { title: "Reg No.", dataIndex: "regNo", key: "regNo" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Party", dataIndex: "party", key: "party" },
    { title: "Item", dataIndex: "item", key: "item" },
    { title: "Qty/Boxes", dataIndex: "qty", key: "qty" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Dept Ref No.", dataIndex: "deptRef", key: "deptRef" },
    { title: "Remark", dataIndex: "remark", key: "remark" },
    { title: "Others", dataIndex: "others", key: "others" },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Form & Table</h1>

      <Input
        placeholder="Search by Party, Item, Department"
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4"
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
       
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Form.Item label="Form/Reg No." name="regNo">
  <Input value={regNo} disabled />
</Form.Item>


          <Form.Item label="Date" name="date" initialValue={dayjs().format("DD-MM-YYYY")}>
  <Input value={dayjs().format("DD-MM-YYYY")} disabled />
</Form.Item>





<Form.Item label="Party" name="party" rules={[{ required: true, message: "Select a party" }]}>
  <Select placeholder="Select Party">
    {parties.map((party, index) => (
      <Select.Option key={index} value={party.name}>{party.name}</Select.Option>
    ))}
  </Select>
</Form.Item>

<Form.Item label="Item" name="item" rules={[{ required: true, message: "Select an item" }]}>
  <Select placeholder="Select Item">
    {items.map((item, index) => (
      <Select.Option key={index} value={item.name}>{item.name}</Select.Option>
    ))}
  </Select>
</Form.Item>

          <Form.Item label="Qty/No. of Box" name="qty" rules={[{ required: true, message: "Enter quantity" }]}>
            <Input type="number" placeholder="Enter Quantity" />
          </Form.Item>

          <Form.Item label="Department" name="department" rules={[{ required: true, message: "Select a department" }]}>
  <Select placeholder="Select Department">
    {departments.map((dept, index) => (
      <Select.Option key={index} value={dept.name}>{dept.name}</Select.Option>
    ))}
  </Select>
</Form.Item>

          <Form.Item label="Department Reference No." name="deptRef">
            <Input placeholder="Enter Reference No." />
          </Form.Item>

          <Form.Item label="Remark" name="remark">
            <Input placeholder="Enter Remark" />
          </Form.Item>

          <Form.Item label="Others Specify" name="others">
            <Input placeholder="Specify if any" />
          </Form.Item>
        </div>

        <Button type="primary" htmlType="submit" className="mt-2">
          Submit
        </Button>
      </Form>

      <Table className="mt-6" dataSource={filteredData} columns={columns} pagination={{ pageSize: 5 }} />

      {/* Modal for Adding New Party */}
      <Modal
        title="Add New Party"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddParty}
      >
        <Input
          placeholder="Enter Party Name"
          value={newParty}
          onChange={(e) => setNewParty(e.target.value)}
        />
      </Modal>
    </div>
  );
}
