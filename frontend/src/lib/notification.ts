import { notifications } from '@mantine/notifications';

type Status = 'success' | 'error' | 'info' | 'warning';

const colors = {
    success: 'green',
    info: 'blue',
    warning: 'yellow',
    error: 'red'
};

export const showNotification = (status: Status, message: string) => {

    notifications.show({
        title: status.charAt(0).toUpperCase() + status.slice(1),
        message,
        color: colors[status],
        radius: 'lg',
        withCloseButton: false
    });
};