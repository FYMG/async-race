type IResponse<T extends Record<PropertyKey, never>> = T & Record<PropertyKey, never>;

export default IResponse;
