import {Link} from 'react-router-dom';

interface IHeaderProps {
  headerText: string;
  subHeader: string;
  hyperlinkText: string;
  routePath: string;
}

function Header({
  headerText, subHeader,
  hyperlinkText, routePath
}: IHeaderProps) {
  return(
    <div className="mb-8">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {headerText}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {subHeader} {' '}
        <Link to={routePath} className="font-medium text-purple-600 hover:text-purple-500">
          {hyperlinkText}
        </Link>
      </p>
    </div>
  )
}

export default Header