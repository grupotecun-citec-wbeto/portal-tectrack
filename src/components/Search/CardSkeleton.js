
import { Skeleton, SkeletonCircle, SkeletonText, Heading } from '@chakra-ui/react'

 // Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";


function CardSkeleton(){
    
    return(
        <Card>
            <CardHeader>
            <Heading size='md'></Heading>
            </CardHeader>
            <CardBody>
                <Skeleton height='20px' />
            </CardBody>
    </Card>   
    )

}

export default CardSkeleton