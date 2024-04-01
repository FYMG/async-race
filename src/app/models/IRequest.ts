type IRequest<T extends Record<PropertyKey, never>> = T & Record<PropertyKey, never>;

export default IRequest;
