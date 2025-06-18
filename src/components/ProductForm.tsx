import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Upload,
  type InputRef,
  type UploadFile
} from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Category } from "../enums/category.enum";
import { Status } from "../enums/status.enum";
import { mockProviders } from "../mocks/providers.mock";
import { mockTags } from "../mocks/tags.mock";
import type { Product } from "../types/IProducts";

let index = 0;

export const ProductForm = ({
  initialValue = null,
  setIsModalOpen,
  onSubmitForm,
}: {
  initialValue: Product | null;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSubmitForm: (value: Product) => void;
}) => {
  const [tagList, setTagList] = useState<string[]>(mockTags);
  const [tagName, setTagName] = useState<string>("");
  const form = Form.useForm<Product>()[0];
  const inputRef = useRef<InputRef>(null);
  const [fileList, setFileList] = useState<UploadFile[]>();

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setTagList([...tagList, tagName || `New item ${index++}`]);
    setTagName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const categoryOptions = Object.entries(Category).map(([key, value]) => ({
    label: key,
    value,
  }));

  const statusOptions = Object.entries(Status).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, " $1").trim(),
    value,
  }));

  const providerOptions = mockProviders.map((it) => ({ value: it, label: it }));

  useEffect(() => {
    if (initialValue) {
      form.setFieldsValue({
        ...initialValue,
        expiredAt: initialValue.expiredAt && dayjs(initialValue.expiredAt),
      });
      setFileList([
        {
          uid: "-1",
          name: `${initialValue.thumbnail?.split("/").pop()}`,
          status: "done",
          url: `${initialValue.thumbnail}`,
          thumbUrl: `${initialValue.thumbnail}`,
        },
      ]);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialValue]);

  return (
      <Form
        form={form}
        labelCol={{ span: 6 }}
        labelAlign="left"
        onFinish={onSubmitForm}
      >
        <Form.Item label="Thumbnail" name="thumbnail">
          <Upload
            maxCount={1}
            beforeUpload={() => false}
            onChange={({ fileList }) => setFileList(fileList)}
            listType="picture"
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Name is required" },
            {
              type: "string",
              max: 100,
              message: "Name cannot exceed 100 characters",
            },
          ]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Provider"
          name="provider"
          rules={[{ required: true, message: "Provider is required" }]}
        >
          <Select placeholder="select your provider">
            {providerOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Expired At" name="expiredAt">
          <DatePicker minDate={dayjs()} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Category is required" }]}
        >
          <Select placeholder="select your category">
            {categoryOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            { required: true, message: "Quantity is required" },
            {
              type: "number",
              min: 1,
              message: "Quantity must be at least 1",
            },
          ]}
        >
          <InputNumber
            placeholder="Enter your quantity"
            style={{ width: 160 }}
          />
        </Form.Item>

        <Form.Item
          label="Price/item"
          name="price"
          rules={[
            { required: true, message: "Price is required" },
            {
              type: "number",
              min: 0,
              message: "Price must be at least 0",
            },
          ]}
        >
          <InputNumber<number>
            step={0.01}
            addonBefore="$"
            formatter={(value) => `${Number(value).toFixed(2)}`}
            parser={(value) => value as unknown as number}
            placeholder="Enter your price"
          />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select
            mode="multiple"
            placeholder="Assign tags"
            popupRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Please enter item"
                    ref={inputRef}
                    value={tagName}
                    onChange={onNameChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
            options={tagList.map((tag) => ({ label: tag, value: tag }))}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Status is required" }]}
        >
          <Radio.Group>
            {statusOptions.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Space
          size="middle"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setIsModalOpen(false);
              form.resetFields();
            }}
            style={{ borderColor: "#d9d9d9", color: "rgba(0, 0, 0, 0.88)" }}
          >
            Cancel
          </Button>
          <Button color="default" variant="solid" htmlType="submit">
            Save
          </Button>
        </Space>
      </Form>
  );
};
