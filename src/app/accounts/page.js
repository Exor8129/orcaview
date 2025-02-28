"use client";

import { useState, useEffect } from "react";
import { Table, Modal, Form, Input, Button } from "antd";

export default function Accounts() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editedDeptRef, setEditedDeptRef] = useState(""); // Declare state
  const [form] = Form.useForm(); // Form instance

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch Data from API and filter by Department = "Accounts"
  const fetchData = async () => {
    try {
      const response = await fetch("/api/register");
      const result = await response.json();
  
      // Filter only "Accounts" department and sort by regNo in ascending order
      const accountsData = result
        .filter((entry) => entry.department === "Accounts")
        .sort((a, b) => a.regNo - b.regNo);
  
      setData(accountsData);
      setFilteredData(accountsData);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };
  

  // Handle row double-click to open modal
  const handleRowDoubleClick = (record) => {
    setSelectedEntry(record);
    setEditedDeptRef(record.deptRef); // Set initial value

    // Populate the form fields with selected entry data
    form.setFieldsValue({
      regNo: record.regNo,
      date: record.date,
      party: record.party,
      item: record.item,
      qty: record.qty,
      department: record.department,
      deptRef: record.deptRef,
      remark: record.remark,
      others: record.others,
    });

    setIsModalVisible(true);
  };

  // Handle form submission
  const handleModalOk = async () => {
    if (!selectedEntry) return;

    try {
        const url = `/api/register/${selectedEntry.id}`;

        
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deptRef: editedDeptRef }),
        });

       

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Failed to update. Server response:", errorMessage);
            throw new Error("Failed to update");
        }

        const updatedEntry = await response.json();
        

        setData((prev) =>
            prev.map((item) => (item.id === updatedEntry.id ? updatedEntry : item))
        );
        fetchData();
        setIsModalVisible(false);
    } catch (error) {
        console.error("Failed to update data:", error);
    }
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
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="id"
        onRow={(record) => ({
          onDoubleClick: () => handleRowDoubleClick(record),
        })}
      />

      {/* Modal Form */}
      <Modal
        title="Edit Department Reference"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Reg No." name="regNo">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Party" name="party">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Item" name="item">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Qty/Boxes" name="qty">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Department" name="department">
            <Input disabled />
          </Form.Item>

          {/* Editable Field */}
          <Form.Item label="Department Reference">
            <Input
              value={editedDeptRef}
              onChange={(e) => setEditedDeptRef(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Remark" name="remark">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Others" name="others">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
