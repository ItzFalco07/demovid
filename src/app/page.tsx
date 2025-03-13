"use client"
import { List, ListItem } from '@/components/tsx/list'

const Page = () => {

    const listItems = new Array(20).fill(0)

    return (
        <List>
            {listItems.map((_, index) => (
                <ListItem key={index}>
                    ListItem: {index + 1}
                </ListItem>
            ))}
        </List>
    )
}

export default Page