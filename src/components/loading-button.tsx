import { NextPage } from 'next'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingButtonProps extends ButtonProps{
    loading: boolean
}

export const LoadingButton: NextPage<LoadingButtonProps> = ({loading, disabled,className, ...props}) => {
  return <Button disabled={loading || disabled} className={cn("flex items-center gap-2", className)} {...props}>
    {loading && <Loader2 className='size-5 animate-spin'/>}
    {props.children}
  </Button>
}
