import React, { FC } from 'react'
import Heading from './components/layouts/Heading'

interface Props {}

const page: FC<Props> = () => {
  return (
    <div>
      <Heading
        title="ELearning"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Programming, MERN, Redux, Machine Learning"
      />
    </div>
  )
}

export default page
